import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Message } from './ChatLayout';
import { ChatMessage } from './ChatMessage';

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
  const [selectedModel, setSelectedModel] = useState(availableModels[0]?.id || '');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // TODO: Handle sending message
      console.log('Sending message:', newMessage, 'with model:', selectedModel);
      setNewMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
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
            <p className="text-sm text-gray-500">{messages.length} messages</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">Start a conversation</p>
              <p className="text-sm">Choose a model and send your first message</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
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
              onKeyPress={handleKeyPress}
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