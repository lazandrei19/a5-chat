import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from './ChatLayout';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser ? 'bg-blue-500 ml-3' : 'bg-gray-200 mr-3'}
        `}>
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-gray-600" />
          )}
        </div>

        {/* Message Content */}
        <div className={`
          rounded-lg px-4 py-3 shadow-sm
          ${isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-900'
          }
        `}>
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
          
          {/* Message Metadata */}
          <div className={`
            flex items-center justify-between mt-2 text-xs
            ${isUser ? 'text-blue-100' : 'text-gray-500'}
          `}>
            <span>{message.timestamp}</span>
            {message.model && !isUser && (
              <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                {message.model}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 