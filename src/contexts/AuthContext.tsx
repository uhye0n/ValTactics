import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, LoginFormData, RegisterFormData, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

// 임시 사용자 데이터
const MOCK_USERS = [
  {
    id: '1',
    username: 'valorant_player',
    email: 'player@valtactics.com',
    password: 'password123',
    rank: 'Diamond 2',
    level: 127,
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date(),
    preferences: {
      theme: 'dark' as const,
      language: 'ko' as const,
      notifications: {
        email: true,
        push: true,
        scenarios: true,
      },
      privacy: {
        showOnlineStatus: true,
        allowFriendRequests: true,
      },
    }
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => u.email === data.email && u.password === data.password);
      
      if (!foundUser) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      const { password, ...userWithoutPassword } = foundUser;
      const updatedUser = {
        ...userWithoutPassword,
        lastLoginAt: new Date()
      };
      
      setUser(updatedUser);
      
      if (data.rememberMe) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterFormData) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.password !== data.confirmPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      if (!data.agreeToTerms) {
        throw new Error('이용약관에 동의해주세요.');
      }

      if (data.password.length < 8) {
        throw new Error('비밀번호는 최소 8자 이상이어야 합니다.');
      }

      const existingUser = MOCK_USERS.find(u => u.email === data.email || u.username === data.username);
      if (existingUser) {
        throw new Error('이미 존재하는 이메일 또는 사용자명입니다.');
      }

      const newUser: User = {
        id: Date.now().toString(),
        username: data.username,
        email: data.email,
        level: 1,
        rank: 'Iron 1',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: 'dark',
          language: 'ko',
          notifications: {
            email: true,
            push: true,
            scenarios: true,
          },
          privacy: {
            showOnlineStatus: true,
            allowFriendRequests: true,
          },
        }
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  }, []);

  // 앱 시작 시 로컬 스토리지에서 사용자 정보 복원
  useEffect(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
