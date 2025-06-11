import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';
import { UserMenu } from './auth/UserMenu';

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__spacer"></div>
        
        <div className="header__logo">
          <h1 className="logo">
            <span className="logo__highlight">V</span>
            <span className="logo__text">a</span>
            <span className="logo__highlight">l</span>
            <span className="logo__text">Tactics</span>
          </h1>
          <div className="text-underline text-underline--logo">
            <div className="text-underline__main"></div>
            <div className="text-underline__accent text-underline__accent--left"></div>
            <div className="text-underline__accent text-underline__accent--right"></div>
          </div>
        </div>        <div className="header__auth">
          <div className="auth-container">            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <button className="auth-button" onClick={() => setIsAuthModalOpen(true)}>
                로그인
              </button>
            )}
            <div className="text-underline text-underline--auth">
              <div className="text-underline__main"></div>
              <div className="text-underline__accent text-underline__accent--left"></div>
              <div className="text-underline__accent text-underline__accent--right"></div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}