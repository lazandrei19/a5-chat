import React, { useEffect, useState } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';

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

export const ChatLayout: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all conversations once on mount
  useEffect(() => {
    fetch('/api/v1/chats')
      .then((res) => res.json())
      .then((data: Conversation[]) => {
        setConversations(data);
        if (data.length) {
          setSelectedConversation(data[0].id);
        }
      })
      .catch((err) => console.error('Failed to fetch conversations', err));
  }, []);

  // Fetch messages whenever the selected conversation changes
  useEffect(() => {
    if (!selectedConversation) return;
    fetch(`/api/v1/chats/${selectedConversation}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
      })
      .catch((err) => console.error('Failed to fetch messages', err));
  }, [selectedConversation]);

  const filteredConversations = conversations.filter((conv: Conversation) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTitle =
    conversations.find((c: Conversation) => c.id === selectedConversation)?.title || 'Chat';

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        conversations={filteredConversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ChatWindow
        messages={messages}
        selectedConversation={selectedConversation}
        conversationTitle={currentTitle}
        availableModels={availableModels}
      />
    </div>
  );
}; 