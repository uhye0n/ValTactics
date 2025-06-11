import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface UserMenuProps {
  onClose?: () => void;
}

export function UserMenu({ onClose }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    onClose?.();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="user-menu">
      <button 
        className="user-menu__trigger"
        onClick={toggleMenu}
        type="button"
      >
        <div className="user-menu__avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} />
          ) : (
            <span className="user-menu__avatar-text">
              {user.username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="user-menu__info">
          <span className="user-menu__name">{user.username}</span>
          <span className="user-menu__rank">{user.rank || 'Unranked'}</span>
        </div>
        <div className="user-menu__arrow">
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path 
              d="M3 4.5L6 7.5L9 4.5" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="user-menu__overlay" onClick={() => setIsOpen(false)} />
          <div className="user-menu__dropdown">
            <div className="user-menu__header">
              <div className="user-menu__header-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <span className="user-menu__header-avatar-text">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="user-menu__header-info">
                <div className="user-menu__header-name">{user.username}</div>
                <div className="user-menu__header-email">{user.email}</div>
                <div className="user-menu__header-stats">
                  <span className="user-menu__level">레벨 {user.level || 1}</span>
                  <span className="user-menu__rank-badge">{user.rank || 'Unranked'}</span>
                </div>
              </div>
            </div>

            <div className="user-menu__divider" />

            <div className="user-menu__items">
              <button className="user-menu__item" type="button">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="currentColor"/>
                  <path d="M8 10C3.58172 10 0 13.5817 0 18H16C16 13.5817 12.4183 10 8 10Z" fill="currentColor"/>
                </svg>
                프로필 편집
              </button>

              <button className="user-menu__item" type="button">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 0C6.96 0 6.11 0.85 6.11 1.89C6.11 2.93 6.96 3.78 8 3.78C9.04 3.78 9.89 2.93 9.89 1.89C9.89 0.85 9.04 0 8 0Z" fill="currentColor"/>
                  <path d="M8 12.22C6.96 12.22 6.11 13.07 6.11 14.11C6.11 15.15 6.96 16 8 16C9.04 16 9.89 15.15 9.89 14.11C9.89 13.07 9.04 12.22 8 12.22Z" fill="currentColor"/>
                  <path d="M8 6.11C6.96 6.11 6.11 6.96 6.11 8C6.11 9.04 6.96 9.89 8 9.89C9.04 9.89 9.89 9.04 9.89 8C9.89 6.96 9.04 6.11 8 6.11Z" fill="currentColor"/>
                </svg>
                설정
              </button>

              <button className="user-menu__item" type="button">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 0L10.9282 5.07088L16 8L10.9282 10.9291L8 16L5.07178 10.9291L0 8L5.07178 5.07088L8 0Z" fill="currentColor"/>
                </svg>
                내 시나리오
              </button>

              <button className="user-menu__item" type="button">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 0C0.89543 0 0 0.895431 0 2V14C0 15.1046 0.89543 16 2 16H14C15.1046 16 16 15.1046 16 14V2C16 0.895431 15.1046 0 14 0H2ZM3 3H13V13H3V3Z" fill="currentColor"/>
                  <path d="M5 5H11V7H5V5Z" fill="currentColor"/>
                  <path d="M5 9H11V11H5V9Z" fill="currentColor"/>
                </svg>
                가이드
              </button>
            </div>

            <div className="user-menu__divider" />

            <div className="user-menu__items">
              <button 
                className="user-menu__item user-menu__item--danger" 
                onClick={handleLogout}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 2H2V14H6V16H2C0.89543 16 0 15.1046 0 14V2C0 0.895431 0.89543 0 2 0H6V2Z" fill="currentColor"/>
                  <path d="M11.7071 4.29289L10.2929 5.70711L12.5858 8H5V10H12.5858L10.2929 12.2929L11.7071 13.7071L16.4142 9L11.7071 4.29289Z" fill="currentColor"/>
                </svg>
                로그아웃
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
