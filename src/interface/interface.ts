export interface HeaderProps {
  toggleSidenav: () => void;
  isSidenavOpen: boolean;
  toggleForm: () => void; // Add this line
}

export interface SidenavProps {
  isSidenavOpen: boolean;
  toggleSidenav: () => void;
}

export interface VideoUploadFormProps {
  toggleForm: () => void;
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
