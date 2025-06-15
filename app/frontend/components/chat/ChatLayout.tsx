import React, { useEffect, useState, cloneElement, isValidElement } from 'react';
// @ts-ignore - path mapping handled by tsconfig
import { ChatSidebar } from './ChatSidebar';
// @ts-ignore
import { usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent } from '../ui/sheet';

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
  
  // Sidebar state management
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

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

  // Handle responsive behavior - collapse sidebar on small screens by default
  const [wasCollapsedByUser, setWasCollapsedByUser] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768; // md breakpoint
      if (isMobile) {
        setIsSidebarCollapsed(true);
        // Close mobile sheet if it's open when resizing to mobile
        setIsMobileSheetOpen(false);
      } else {
        // On desktop, only show the sidebar by default if it wasn't manually collapsed by the user
        if (isSidebarCollapsed && window.innerWidth >= 768 && !wasCollapsedByUser) {
          setIsSidebarCollapsed(false);
        }
      }
    };

    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarCollapsed, wasCollapsedByUser]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + B to toggle sidebar on desktop
      if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
        event.preventDefault();
        if (window.innerWidth >= 768) {
          const newCollapsedState = !isSidebarCollapsed;
          setIsSidebarCollapsed(newCollapsedState);
          setWasCollapsedByUser(newCollapsedState);
        } else {
          setIsMobileSheetOpen(!isMobileSheetOpen);
        }
      }
      // Escape to close mobile sheet
      if (event.key === 'Escape' && isMobileSheetOpen) {
        setIsMobileSheetOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarCollapsed, isMobileSheetOpen, wasCollapsedByUser]);

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

  const handleConversationSelect = (id: string) => {
    setSelectedConversation(id);
    // Close mobile sheet when conversation is selected
    setIsMobileSheetOpen(false);
  };

  const sidebarProps = {
    conversations: filteredConversations,
    selectedConversation,
    onSelectConversation: handleConversationSelect,
    searchQuery,
    onSearchChange: setSearchQuery,
    isCollapsed: isSidebarCollapsed,
    onToggleCollapse: () => setIsSidebarCollapsed(!isSidebarCollapsed)
  };

  const mobileSidebarProps = {
    ...sidebarProps,
    isMobile: true
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-0' : 'w-80'
      }`}>
        <div className={`${isSidebarCollapsed ? 'hidden' : 'block'} w-80 transition-opacity duration-300 ${
          isSidebarCollapsed ? 'opacity-0' : 'opacity-100'
        }`}>
          <ChatSidebar {...sidebarProps} />
        </div>
      </div>

      {/* Mobile Sheet Sidebar */}
      <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <SheetContent side="left" className="w-80 p-0 md:hidden">
          <ChatSidebar {...mobileSidebarProps} />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex-1 h-full bg-white flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header with Menu Button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMobileSheetOpen(true);
            }}
            className="h-9 w-9 p-0 hover:bg-gray-100"
            title="Open sidebar"
            type="button"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {conversationTitle}
          </h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Desktop Header with Toggle Button */}
        <div className="hidden md:flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Toggle sidebar visibility
                const newCollapsedState = !isSidebarCollapsed;
                setIsSidebarCollapsed(newCollapsedState);
                setWasCollapsedByUser(newCollapsedState);
              }}
              className="h-9 w-9 p-0 hover:bg-gray-100"
              title={`${isSidebarCollapsed ? 'Show' : 'Hide'} sidebar (⌘B)`}
              type="button"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              {conversationTitle}
            </h1>
          </div>
        </div>

        {/* Chat content - This will be independently scrollable */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {isValidElement(children)
            ? cloneElement(children as React.ReactElement<any>, forwardedProps)
            : children}
        </div>
      </div>
    </div>
  );
}; 