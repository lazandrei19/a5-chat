import React, { useEffect, useState, cloneElement, isValidElement } from 'react';
// @ts-ignore - path mapping handled by tsconfig
import { ChatSidebar } from './ChatSidebar';
// @ts-ignore
import { usePage } from '@inertiajs/react';

// Types for conversations and messages coming from the backend
export interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  messageCount: number;
  hasNewActivity: boolean;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  model?: string;
}

const availableModels = [
  { id: 'google/gemini-2.5-flash-preview-05-20', name: 'Gemini 2.5 Flash' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'claude-3.5', name: 'Claude 3.5 Sonnet' },
  { id: 'claude-3', name: 'Claude 3 Opus' }
];

export interface ChatLayoutProps {
  children: React.ReactNode;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const page = usePage();

  // Destructure the props provided by the server (via Inertia).
  const {
    chats: initialChats,
    messages: pageMessages = [],
    selected_conversation: selectedConversationProp = '',
    conversation_title: conversationTitleProp = ''
  } = page.props as {
    chats: Conversation[];
    messages?: Message[];
    selected_conversation?: string;
    conversation_title?: string;
  };

  // Extract conversation ID from the current URL if present, e.g. /chat/<uuid>
  const match = (page as any).url?.match?.(/^\/chat\/(.+)/);
  const urlConversationId = match ? match[1] : '';

  const [conversations, setConversations] = useState<Conversation[]>(initialChats || []);

  // Local state for the active conversation (for immediate UI feedback).
  const [selectedConversation, setSelectedConversation] = useState<string>(
    selectedConversationProp || urlConversationId
  );

  const [searchQuery, setSearchQuery] = useState('');

  // Select first conversation whenever conversation list changes (initial load or prop update)
  useEffect(() => {
    if (conversations.length && !selectedConversation) {
      setSelectedConversation(conversations[0].id);
    }
  }, [conversations]);

  // Sync local selectedConversation when the server sends a new active ID
  useEffect(() => {
    if (selectedConversationProp && selectedConversationProp !== selectedConversation) {
      setSelectedConversation(selectedConversationProp);
    }
  }, [selectedConversationProp]);

  // Also keep selectedConversation in sync with URL changes (e.g. browser nav).
  useEffect(() => {
    if (urlConversationId && urlConversationId !== selectedConversation) {
      setSelectedConversation(urlConversationId);
    }
  }, [urlConversationId]);

  const filteredConversations = conversations.filter((conv: Conversation) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const conversationTitle =
    conversationTitleProp ||
    conversations.find((c) => c.id === selectedConversation)?.title || 'Chat';

  // Prepare the props we want to forward to the page component (child)
  const forwardedProps = {
    messages: pageMessages,
    selectedConversation,
    conversationTitle,
    availableModels
  } as const;

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        conversations={filteredConversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main content area where the active chat (child) will be rendered */}
      <div className="flex-1 h-full bg-white">
        {isValidElement(children)
          ? cloneElement(children as React.ReactElement<any>, forwardedProps)
          : children}
      </div>
    </div>
  );
}; 