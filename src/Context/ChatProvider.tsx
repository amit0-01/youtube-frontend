import { createContext, useContext, useState } from 'react';
import { ChatContextType, ChatProviderProps } from '../interface/interface';


// Create a context with a default value of `undefined`
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// ChatProvider Component
export function ChatProvider({ children }: ChatProviderProps): JSX.Element {
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  return (
    <ChatContext.Provider value={{ chatHistory, setChatHistory }}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook to use the ChatContext
export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
