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
  const [newMessage, setNewMessage] = useState('');
  // Determine initial model: last message model if present, else first available
  const getLastModelId = (msgs: Message[]): string | undefined => {
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].model) return msgs[i].model;
    }
    return undefined;
  };

  const [selectedModel, setSelectedModel] = useState(
    getLastModelId(messages) || availableModels[0]?.id || '',
  );
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Maintain a local copy of the messages so we can update as streams arrive
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);

  // Keep localMessages in sync when the prop changes (e.g., page navigation)
  useEffect(() => {
    setLocalMessages(messages);

    // Update the selected model when the conversation messages change
    const lastModel = getLastModelId(messages);
    if (lastModel && lastModel !== selectedModel) {
      setSelectedModel(lastModel);
    }
  }, [messages]);

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
          if (data.type === 'new_message') {
            setLocalMessages((prev) => [...prev, data.message]);
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
            setLocalMessages((prev) => {
              const idx = prev.findIndex((m) => m.id === data.message.id);
              if (idx === -1) {
                return [...prev, data.message];
              }
              const newArr = [...prev];
              newArr[idx] = data.message;
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

    // Optimistically add the user message to the UI immediately
    const optimistic: Message = {
      id: `${Date.now()}`,
      content: trimmed,
      role: 'user',
      timestamp: new Date().toISOString(),
    } as Message;
    setLocalMessages((prev) => [...prev, optimistic]);

    // Send to the backend via ActionCable
    sendOverCable(trimmed);

    setNewMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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
    <div className="flex-1 flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{conversationTitle}</h2>
            <p className="text-sm text-gray-500">{localMessages.length} messages</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {localMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">Start a conversation</p>
              <p className="text-sm">Choose a model and send your first message</p>
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
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3">
          {/* Model Selector */}
          <div className="relative">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>{selectedModelName}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {isModelDropdownOpen && (
              <div className="absolute bottom-full mb-2 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {availableModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setIsModelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        selectedModel === model.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
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
            <textarea
              ref={textareaRef}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyPress}
              className="w-full min-h-[44px] max-h-[120px] resize-none rounded-lg border border-gray-300 px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
              className="absolute right-2 bottom-2 p-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 