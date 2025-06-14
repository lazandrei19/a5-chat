import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Message } from './ChatLayout';
import { ChatMessage } from './ChatMessage';
import { cable } from '../../lib/cable';

interface Model {
  id: string;
  name: string;
}

interface ChatWindowProps {
  messages: Message[];
  selectedConversation: string;
  conversationTitle: string;
  availableModels: Model[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  selectedConversation,
  conversationTitle,
  availableModels
}) => {
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [newMessage, setNewMessage] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getLastModelId = (msgs: Message[]): string | undefined => {
    // Find the last message with a model_id
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].model) {
        return msgs[i].model;
      }
    }
    return undefined;
  };

  // Determine initial model: last message model if present, else first available
  const initialModel = getLastModelId(messages) || availableModels[0]?.id || 'google/gemini-2.0-flash-thinking-exp-01-21';
  const [selectedModel, setSelectedModel] = useState<string>(initialModel);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  };

  // Function to scroll so a specific message appears at the top of the viewport
  const scrollToShowMessageAtTop = (messageId: string) => {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const messageRect = messageElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Calculate the scroll position to put the message at the top
      const scrollTop = container.scrollTop + (messageRect.top - containerRect.top);
      container.scrollTop = scrollTop;
    }
  };

  // Keep localMessages in sync when the prop changes (e.g., page navigation)
  useEffect(() => {
    setLocalMessages(messages);

    // Update the selected model when the conversation messages change
    const lastModel = getLastModelId(messages);
    if (lastModel && lastModel !== selectedModel) {
      setSelectedModel(lastModel);
    }

    // Scroll to bottom when messages change (conversation loaded)
    setTimeout(scrollToBottom, 100);
  }, [messages, selectedModel]);

  // ActionCable subscription, re-establish whenever the selected conversation changes
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!selectedConversation) return;

    // Unsubscribe from any previous subscription first
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = cable.subscriptions.create(
      { channel: 'ChatChannel', chat_id: selectedConversation },
      {
        received: (data: any) => {
          if (data.type === 'user_message') {
            // Handle user messages from other tabs
            setLocalMessages((prev) => {
              // Check if this message already exists (to avoid duplicates)
              const existingIndex = prev.findIndex((m) => m.id === data.message.id);
              if (existingIndex !== -1) {
                return prev; // Message already exists, don't add duplicate
              }
              
              // Remove any pending optimistic message with similar content and timestamp
              let removedOptimisticId: string | null = null;
              const filteredMessages = prev.filter((msg) => {
                const isOptimistic = msg.id.toString().startsWith('temp_');
                const isSimilar = msg.content === data.message.content && 
                                 msg.role === 'user' &&
                                 Math.abs(new Date(msg.timestamp).getTime() - new Date(data.message.timestamp).getTime()) < 5000;
                if (isOptimistic && isSimilar) {
                  removedOptimisticId = msg.id;
                  return false;
                }
                return true;
              });
              
              // Clean up pending messages if we removed an optimistic one
              if (removedOptimisticId) {
                setPendingMessages(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(removedOptimisticId!);
                  return newSet;
                });
              }
              
              return [...filteredMessages, data.message];
            });
          } else if (data.type === 'stream') {
            setLocalMessages((prev) => {
              const idx = prev.findIndex((m) => m.id === data.message_id);
              if (idx === -1) {
                // First chunk, create a new assistant message
                return [
                  ...prev,
                  {
                    id: data.message_id,
                    content: data.content,
                    role: 'assistant',
                    timestamp: new Date().toISOString(),
                    model: undefined,
                  } as Message,
                ];
              }
              // Append content to existing message
              return prev.map((msg, i) =>
                i === idx ? { ...msg, content: (msg.content || '') + data.content } : msg,
              );
            });
          } else if (data.type === 'final') {
            console.log('Final message received:', data.message);
            setLocalMessages((prev) => {
              const idx = prev.findIndex((m) => m.id === data.message.id);
              console.log('Found existing message at index:', idx);
              if (idx === -1) {
                // If message not found, just add it
                console.log('Adding new final message');
                return [...prev, data.message];
              }
              // Replace the existing message, but ensure we preserve content if final message is empty
              const existingMessage = prev[idx];
              console.log('Existing message content length:', existingMessage.content?.length);
              console.log('Final message content length:', data.message.content?.length);
              const finalMessage = {
                ...data.message,
                content: data.message.content || existingMessage.content // Preserve existing content if final is empty
              };
              const newArr = [...prev];
              newArr[idx] = finalMessage;
              return newArr;
            });
          } else if (data.type === 'error') {
            setLocalMessages((prev) => [...prev, data.message]);
          }
        },
      },
    );

    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
    };
  }, [selectedConversation]);

  const sendOverCable = (content: string) => {
    if (!subscriptionRef.current) return;
    subscriptionRef.current.perform('send_message', {
      chat_id: selectedConversation,
      content,
      model_id: selectedModel,
    });
  };

  const handleRetry = (messageId: string) => {
    // Find the user message that preceded this error message
    const messageIndex = localMessages.findIndex(m => m.id === messageId);
    if (messageIndex > 0) {
      const previousMessage = localMessages[messageIndex - 1];
      if (previousMessage.role === 'user') {
        // Remove the error message and retry with the previous user message
        setLocalMessages(prev => prev.filter(m => m.id !== messageId));
        sendOverCable(previousMessage.content);
      }
    }
  };

  const handleSendMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    // Create a temporary ID for the optimistic message
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const optimistic: Message = {
      id: tempId,
      content: trimmed,
      role: 'user',
      timestamp: new Date().toISOString(),
    } as Message;
    
    // Add to pending messages to track optimistic updates
    setPendingMessages(prev => new Set([...prev, tempId]));
    setLocalMessages((prev) => [...prev, optimistic]);

    // Send to the backend via ActionCable
    sendOverCable(trimmed);

    setNewMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Scroll to show the user's message at the top of the viewport
    setTimeout(() => scrollToShowMessageAtTop(tempId), 50);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage]);

  const selectedModelName = availableModels.find(m => m.id === selectedModel)?.name || 'Select Model';

  return (
    <div className="flex-1 flex flex-col h-full bg-white min-h-0">
      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto bg-gray-50/30 min-h-0">
        {localMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center text-gray-500 max-w-md">
              <p className="text-lg font-medium mb-2 text-gray-700">Start a conversation</p>
              <p className="text-sm text-gray-500">Choose a model and send your first message to begin chatting</p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {localMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
              />
            ))}
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-6 py-4 flex-shrink-0">
        <div className="flex items-start space-x-4 max-w-4xl mx-auto">
          {/* Model Selector */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center justify-center space-x-2 px-4 h-12 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <span>{selectedModelName}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {isModelDropdownOpen && (
              <div className="absolute bottom-full mb-2 left-0 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                <div className="py-1">
                  {availableModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setIsModelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                        selectedModel === model.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-900'
                      }`}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <div className="relative flex items-center">
              <textarea
                ref={textareaRef}
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={handleKeyPress}
                className="w-full min-h-[48px] max-h-[120px] resize-none rounded-xl border border-gray-300 px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                rows={1}
                style={{ height: '48px' }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
                className="absolute right-2 h-8 w-8 p-0 rounded-lg"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 