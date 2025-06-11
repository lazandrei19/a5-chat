import type { FC } from 'react';
import AuthLayout from '../Layout';
import { ChatLayout } from '@/components/chat/ChatLayout';
import { ChatWindow } from '@/components/chat/ChatWindow';
import type { Message } from '@/components/chat/ChatLayout';

interface HomeProps {
  messages: Message[];
  selectedConversation: string;
  conversationTitle: string;
  availableModels: { id: string; name: string }[];
}

// Using Partial to allow ChatLayout to inject props after the first render
const Home: FC<Partial<HomeProps>> = (props) => {
  if (!props.selectedConversation) return null;

  return (
    <ChatWindow
      messages={props.messages ?? []}
      selectedConversation={props.selectedConversation}
      conversationTitle={props.conversationTitle ?? ''}
      availableModels={props.availableModels ?? []}
    />
  );
};

// @ts-ignore - Inertia allows assigning a layout function at runtime
Home.layout = (page: React.ReactNode) => (
  <AuthLayout>
    <ChatLayout>{page}</ChatLayout>
  </AuthLayout>
);

export default Home;