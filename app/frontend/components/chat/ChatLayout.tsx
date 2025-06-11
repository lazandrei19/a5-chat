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
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'claude-3.5', name: 'Claude-3.5 Sonnet' },
  { id: 'claude-3', name: 'Claude-3 Opus' }
];

export interface ChatLayoutProps {
  children: React.ReactNode;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const page = usePage();
  const { chats: initialChats } = page.props as { chats: Conversation[] };

  // Extract conversation ID from the current URL if present, e.g. /chat/<uuid>
  const match = (page as any).url?.match?.(/^\/chat\/(.+)/);
  const urlConversationId = match ? match[1] : '';

  const [conversations, setConversations] = useState<Conversation[]>(initialChats || []);
  const [selectedConversation, setSelectedConversation] = useState<string>(urlConversationId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Select first conversation whenever conversation list changes (initial load or prop update)
  useEffect(() => {
    if (conversations.length && !selectedConversation) {
      setSelectedConversation(conversations[0].id);
    }
  }, [conversations]);

  // Keep selectedConversation in sync with URL on subsequent page visits
  useEffect(() => {
    if (urlConversationId && urlConversationId !== selectedConversation) {
      setSelectedConversation(urlConversationId);
    }
  }, [urlConversationId]);

  // Fetch messages whenever the selected conversation changes
  useEffect(() => {
    if (!selectedConversation) return;

    fetch(`/api/v1/chats/${selectedConversation}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []))
      .catch((err) => console.error('Failed to fetch messages', err));
  }, [selectedConversation]);

  const filteredConversations = conversations.filter((conv: Conversation) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const conversationTitle =
    conversations.find((c) => c.id === selectedConversation)?.title || 'Chat';

  // Prepare the props we want to forward to the page component (child)
  const forwardedProps = {
    messages,
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
      <div className="flex-1 h-full">
        {isValidElement(children)
          ? cloneElement(children as React.ReactElement<any>, forwardedProps)
          : children}
      </div>
    </div>
  );
}; 