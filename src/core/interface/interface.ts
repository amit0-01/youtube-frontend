import { ReactNode } from "react";

export interface HeaderProps {
  toggleSidenav: () => void;
  isSidenavOpen: boolean;
  toggleForm: () => void;
  setSearchTerm: (searchTerm: string) => void;
}

export interface SidenavProps {
  isSidenavOpen: boolean;
  toggleSidenav: () => void;
}

export interface VideoUploadFormProps {
  toggleForm: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FormValues {
  username: string;
  password: string;
}

export interface FormErrors {
  username?: string;
  password?: string;
}


export interface WarningDialogProps {
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ChatProviderProps {
  children: ReactNode;
}

// Define the type for the chat context
export interface ChatContextType {
  chatHistory: string[];
  setChatHistory: React.Dispatch<React.SetStateAction<string[]>>;
}