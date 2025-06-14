import React from 'react';
// @ts-ignore - Link type may not yet exist in our Inertia typings
import { Link } from '@inertiajs/react';
import { Search, Plus, Settings, User, Ellipsis } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Conversation } from './ChatLayout';

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversation: string;
  onSelectConversation: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false
}) => {
  return (
    <div className="w-full bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
          <Button size="sm" className="h-9 w-9 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2">
          {conversations.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-sm">No conversations found</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Link
                href={`/chat/${conversation.id}`}
                key={conversation.id}
                onClick={(e: React.MouseEvent) => {
                  // Always call the conversation selection handler
                  onSelectConversation(conversation.id);
                  
                  // If this is the currently selected conversation, prevent navigation
                  // to avoid unnecessary page reloads
                  if (selectedConversation === conversation.id) {
                    e.preventDefault();
                  }
                }}
                className={`
                  block p-3 mx-1 rounded-xl cursor-pointer transition-all duration-200 mb-1 group
                  ${selectedConversation === conversation.id
                    ? 'bg-blue-50 border border-blue-200 shadow-sm'
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 truncate text-sm">
                        {conversation.title}
                      </h3>
                      {conversation.hasNewActivity && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {conversation.messageCount} messages
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Ellipsis className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* User Account Section */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">john@example.com</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Settings className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}; 