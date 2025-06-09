import React, { useState } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';

// Dummy conversation data
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

export interface ChatData {
  [conversationId: string]: Message[];
}

const dummyConversations: Conversation[] = [
  {
    id: '1',
    title: 'React Best Practices',
    timestamp: '2 minutes ago',
    messageCount: 12,
    hasNewActivity: true
  },
  {
    id: '2',
    title: 'TypeScript Question',
    timestamp: '1 hour ago',
    messageCount: 8,
    hasNewActivity: false
  },
  {
    id: '3',
    title: 'Database Design Help',
    timestamp: '3 hours ago',
    messageCount: 15,
    hasNewActivity: true
  },
  {
    id: '4',
    title: 'API Architecture',
    timestamp: '1 day ago',
    messageCount: 6,
    hasNewActivity: false
  },
  {
    id: '5',
    title: 'CSS Grid Layout',
    timestamp: '2 days ago',
    messageCount: 9,
    hasNewActivity: false
  }
];

const dummyChatData: ChatData = {
  '1': [
    {
      id: 'm1',
      content: 'What are some React best practices I should follow?',
      role: 'user',
      timestamp: '10:30 AM'
    },
    {
      id: 'm2',
      content: 'Here are some key React best practices:\n\n1. **Use functional components** with hooks instead of class components\n2. **Keep components small and focused** - each component should have a single responsibility\n3. **Use proper state management** - useState for local state, useContext or external libraries for global state\n4. **Optimize re-renders** with React.memo, useMemo, and useCallback when needed\n5. **Follow naming conventions** - use PascalCase for components, camelCase for functions\n\nWould you like me to elaborate on any of these points?',
      role: 'assistant',
      timestamp: '10:31 AM',
      model: 'GPT-4'
    },
    {
      id: 'm3',
      content: 'Can you explain more about useEffect best practices?',
      role: 'user',
      timestamp: '10:32 AM'
    },
    {
      id: 'm4',
      content: 'Absolutely! Here are useEffect best practices:\n\n**1. Always include dependencies**\n```javascript\nuseEffect(() => {\n  // effect code\n}, [dependency1, dependency2]);\n```\n\n**2. Clean up side effects**\n```javascript\nuseEffect(() => {\n  const timer = setInterval(() => {}, 1000);\n  return () => clearInterval(timer);\n}, []);\n```\n\n**3. Separate concerns** - use multiple useEffect hooks for different concerns\n\n**4. Avoid infinite loops** - be careful with object/array dependencies',
      role: 'assistant',
      timestamp: '10:33 AM',
      model: 'GPT-4'
    },
    {
      id: 'm5',
      content: 'Thanks for the explanation about useEffect!',
      role: 'user',
      timestamp: '10:35 AM'
    }
  ],
  '2': [
    {
      id: 'm6',
      content: 'How do I type this generic function in TypeScript?',
      role: 'user',
      timestamp: '9:30 AM'
    },
    {
      id: 'm7',
      content: 'Could you share the function you\'re trying to type? That would help me give you a more specific answer. In general, TypeScript generics follow this pattern:\n\n```typescript\nfunction myFunction<T>(param: T): T {\n  return param;\n}\n```\n\nThe `<T>` declares a type parameter that can be used throughout the function.',
      role: 'assistant',
      timestamp: '9:31 AM',
      model: 'Claude-3.5'
    }
  ]
};

const availableModels = [
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'claude-3.5', name: 'Claude-3.5 Sonnet' },
  { id: 'claude-3', name: 'Claude-3 Opus' },
];

export const ChatLayout: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = dummyConversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = dummyChatData[selectedConversation] || [];

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
        messages={currentMessages}
        selectedConversation={selectedConversation}
        conversationTitle={dummyConversations.find(c => c.id === selectedConversation)?.title || 'Chat'}
        availableModels={availableModels}
      />
    </div>
  );
}; 