import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, LoginFormData, RegisterFormData, ProfileUpdateData, AuthContextType } from '../types/auth';
import apiService from '../services/api';
import socketService from '../services/socket';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const login = useCallback(async (data: LoginFormData) => {
    setIsLoading(true);
      try {
      // 백엔드 API 호출
      const response = await apiService.login({
        email: data.email,
        password: data.password
      }) as { user: User; token: string };
      
      const { user, token } = response;
      setUser(user);
      
      // Socket 연결 (토큰과 함께)
      socketService.connect(token);
      
      // 토큰 저장
      if (data.rememberMe) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('auth_token', token);
      } else {
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('auth_token', token);
      }
      
    } catch (error: any) {
      throw new Error(error.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  const register = useCallback(async (data: RegisterFormData) => {
    setIsLoading(true);
    
    try {
      // 클라이언트 검증
      if (data.password !== data.confirmPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      if (!data.agreeToTerms) {
        throw new Error('이용약관에 동의해주세요.');
      }

      if (data.password.length < 6) {
        throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
      }      // 백엔드 API 호출
      const response = await apiService.register({
        username: data.username,
        email: data.email,
        password: data.password
      }) as { user: User; token: string };
      
      const { user, token } = response;      setUser(user);
      
      // Socket 연결 (토큰과 함께)
      socketService.connect(token);
      
      // 토큰과 사용자 정보 저장
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
      
    } catch (error: any) {
      throw new Error(error.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);  const logout = useCallback(() => {
    setUser(null);
    
    // 저장된 토큰과 사용자 정보 제거
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    
    // API 서비스에서 토큰 제거
    apiService.removeToken();
    
    // Socket 연결 해제
    socketService.disconnect();
  }, []);

  const updateProfile = useCallback(async (data: ProfileUpdateData) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      const updatedUser = {
        ...user,
        ...data,
        lastLoginAt: new Date()
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  // 앱 시작 시 로컬 스토리지에서 사용자 정보 복원
  useEffect(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    const savedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        setUser(user);
        apiService.setToken(savedToken);
        socketService.connect(savedToken);
      } catch (error) {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
      }
    }
  }, []);
  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
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
