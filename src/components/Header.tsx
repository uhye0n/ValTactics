import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';
import { UserMenu } from './auth/UserMenu';

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleBackClick = () => {
    navigate('/');
  };  const isNewScenarioPage = location.pathname === '/new-scenario';
  const isScenarioEditorPage = location.pathname === '/scenario-editor' || location.pathname.startsWith('/editor/');
  const isMyScenarioPage = location.pathname === '/my-scenarios';
  const showBackNavigation = isNewScenarioPage || isScenarioEditorPage || isMyScenarioPage;

  return (
    <header className="header">
      <div className="header__container">
        {showBackNavigation ? (
          <div className="header__back">
            <div className="back-nav-container">
              <button className="back-button" onClick={handleBackClick}>
                <div className="back-icon">
                  <svg
                    width="26"
                    height="32"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 26 32"
                  >
                    <path d="M16 1L1 16" stroke="white" strokeLinecap="round" strokeWidth="2" />
                    <path d="M16 31L1 16" stroke="white" strokeLinecap="round" strokeWidth="2" />
                    <circle cx="12" cy="16" fill="white" r="2" />
                  </svg>
                </div>
                <span className="back-text">뒤로가기</span>
              </button>
                <div className="breadcrumb">
                <div className="breadcrumb-arrow" />
                <div className="breadcrumb-arrow" />                <span className="breadcrumb-text">
                  {isNewScenarioPage ? '새 시나리오' : 
                   isScenarioEditorPage ? '시나리오 에디터' : 
                   isMyScenarioPage ? '내 시나리오' : '메인화면'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="header__spacer"></div>
        )}
        
        <div className="header__logo">
          <h1 className="logo" onClick={handleLogoClick}>
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
          <div className="auth-container">
            {isAuthenticated ? (
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