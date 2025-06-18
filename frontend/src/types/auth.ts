export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  rank?: string;
  level?: number;
  createdAt: Date;
  lastLoginAt?: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  language: 'ko' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    scenarios: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    allowFriendRequests: boolean;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ProfileUpdateData {
  username?: string;
  avatar?: string;
  rank?: string;
  level?: number;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  isAuthenticated: boolean;
}
