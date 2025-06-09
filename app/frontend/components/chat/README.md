# Chat Interface Components

This directory contains the components for the LLM chat application interface.

## Components

### `ChatLayout`
The main layout component that orchestrates the entire chat interface. It contains the sidebar and main chat window.

**Features:**
- Manages conversation selection
- Handles search functionality
- Contains dummy data for development

### `ChatSidebar`
The left sidebar containing:
- List of conversations with search functionality
- New chat button
- User account section with settings button

### `ChatWindow`
The main chat interface containing:
- Message display area
- Model selection dropdown
- Message input with send functionality

### `ChatMessage`
Individual message component for displaying user and assistant messages. Each message is its own component to make implementing per-message buttons easier in the future.

**Features:**
- Distinct styling for user vs assistant messages
- Avatar display
- Timestamp and model information
- Proper text formatting

## Usage

```tsx
import { ChatLayout } from './components/chat';

function App() {
  return <ChatLayout />;
}
```

## Dummy Data

The components currently use dummy data including:
- 5 sample conversations
- Sample messages with realistic content
- Available AI models (GPT-4, GPT-3.5, Claude variants)

## Future Enhancements

Since each message is its own component, you can easily add:
- Copy message button
- Regenerate response button
- Edit message functionality
- Message reactions
- Export conversation features

## Styling

The interface uses:
- Tailwind CSS for styling
- Lucide React for icons
- Radix UI components for accessible interactions
- Modern design with proper hover states and transitions 