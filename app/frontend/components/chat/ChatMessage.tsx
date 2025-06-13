import React, { useState } from 'react';
import { Bot, User, Copy, RefreshCw, Edit3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Message } from './ChatLayout';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.role === 'assistant' && message.content.includes('⚠️');
  const [isHovered, setIsHovered] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleRegenerate = () => {
    // TODO: Implement regenerate functionality
    console.log('Regenerating message...');
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Editing message...');
  };

  if (isUser) {
    // User message - right-aligned bubble style
    return (
      <div 
        className="group relative mb-6 px-4 py-3 hover:bg-gray-50/50 transition-colors duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-end max-w-4xl mx-auto">
          <div className="max-w-[70%]">
            {/* User message bubble */}
            <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-sm">
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
            </div>

            {/* Action Buttons and Timestamp - Only show on hover */}
            <div className={`
              flex items-center justify-end space-x-1 mt-2 transition-opacity duration-200
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}>
              <div className="text-xs text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Assistant message - clean left-aligned style
  return (
    <div 
      className="group relative mb-6 px-4 py-3 hover:bg-gray-50/50 transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-4xl mx-auto">
        {/* Message Text */}
        <div className={`prose prose-sm max-w-none leading-relaxed ${
          isError ? 'text-red-800 bg-red-50 p-3 rounded-lg border border-red-200' : 'text-gray-900'
        }`}>
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>

        {/* Action Buttons and Model Info - Only show on hover */}
        <div className={`
          flex items-center justify-between mt-3 transition-opacity duration-200
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={`h-8 px-2 hover:bg-gray-100 ${
                isError ? 'text-red-500 hover:text-red-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerate}
              className={`h-8 px-2 hover:bg-gray-100 ${
                isError ? 'text-red-500 hover:text-red-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {message.model && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isError ? 'text-red-600 bg-red-100' : 'text-gray-500 bg-gray-100'
              }`}>
                {message.model}
              </span>
            )}
            <div className={`text-xs ${isError ? 'text-red-400' : 'text-gray-400'}`}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 