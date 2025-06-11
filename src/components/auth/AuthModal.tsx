import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginFormData, RegisterFormData } from '../../types/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string>('');
  const { login, register, isLoading } = useAuth();
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');    try {
      await login(loginForm);
      onClose();
      setLoginForm({ email: '', password: '', rememberMe: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');    try {
      await register(registerForm);
      onClose();
      setRegisterForm({ username: '', email: '', password: '', confirmPassword: '', agreeToTerms: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };  const handleClose = () => {
    onClose();
    setError('');
    setLoginForm({ email: '', password: '', rememberMe: false });
    setRegisterForm({ username: '', email: '', password: '', confirmPassword: '', agreeToTerms: false });
  };  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="auth-modal">
        <button 
          onClick={handleClose}
          className="auth-modal__close-button"
          type="button"
          aria-label="닫기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M18 6L6 18M6 6L18 18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        <DialogHeader>
          <DialogTitle className="auth-modal__title">
            {mode === 'login' ? '로그인' : '회원가입'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="auth-modal__error">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="auth-modal__form">
            <div className="auth-modal__field">
              <label htmlFor="email" className="auth-modal__label">
                이메일
              </label>
              <Input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
                disabled={isLoading}
                placeholder="이메일을 입력하세요"
              />
            </div>            <div className="auth-modal__field">
              <label htmlFor="password" className="auth-modal__label">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                disabled={isLoading}
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <div className="auth-modal__field">
              <label className="auth-modal__checkbox-container">
                <input
                  type="checkbox"
                  checked={loginForm.rememberMe || false}
                  onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                  disabled={isLoading}
                  className="auth-modal__checkbox"
                />
                <span className="auth-modal__checkbox-text">로그인 기억하기</span>
              </label>
            </div>

            <Button 
              type="submit" 
              className="auth-modal__submit"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="auth-modal__form">
            <div className="auth-modal__field">
              <label htmlFor="username" className="auth-modal__label">
                사용자명
              </label>
              <Input
                id="username"
                type="text"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                required
                disabled={isLoading}
                placeholder="사용자명을 입력하세요"
              />
            </div>

            <div className="auth-modal__field">
              <label htmlFor="register-email" className="auth-modal__label">
                이메일
              </label>
              <Input
                id="register-email"
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
                disabled={isLoading}
                placeholder="이메일을 입력하세요"
              />
            </div>

            <div className="auth-modal__field">
              <label htmlFor="register-password" className="auth-modal__label">
                비밀번호
              </label>
              <Input
                id="register-password"
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
                disabled={isLoading}
                placeholder="비밀번호를 입력하세요"
              />
            </div>            <div className="auth-modal__field">
              <label htmlFor="confirm-password" className="auth-modal__label">
                비밀번호 확인
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                required
                disabled={isLoading}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>

            <div className="auth-modal__field">
              <label className="auth-modal__checkbox-container">
                <input
                  type="checkbox"
                  checked={registerForm.agreeToTerms}
                  onChange={(e) => setRegisterForm({ ...registerForm, agreeToTerms: e.target.checked })}
                  disabled={isLoading}
                  className="auth-modal__checkbox"
                  required
                />
                <span className="auth-modal__checkbox-text">
                  <span>이용약관 및 개인정보처리방침에 동의합니다 </span>
                  <span className="auth-modal__required">*</span>
                </span>
              </label>
            </div>

            <Button 
              type="submit" 
              className="auth-modal__submit"
              disabled={isLoading}
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </Button>
          </form>
        )}

        <div className="auth-modal__switch">
          <span className="auth-modal__switch-text">
            {mode === 'login' ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          </span>
          <button
            type="button"
            onClick={switchMode}
            className="auth-modal__switch-button"
            disabled={isLoading}
          >
            {mode === 'login' ? '회원가입' : '로그인'}
          </button>
        </div>

        <div className="auth-modal__demo">
          <p className="auth-modal__demo-text">
            데모 계정으로 로그인하기:
          </p>
          <p className="auth-modal__demo-info">
            이메일: player@valtactics.com<br />
            비밀번호: password123
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
