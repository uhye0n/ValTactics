import React from 'react';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleModal({ isOpen, onClose }: SimpleModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#1a1a2e',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          maxWidth: '400px',
          width: '90%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 1rem 0', color: '#ff2736' }}>
          간단한 테스트 모달
        </h2>
        <p style={{ margin: '0 0 1.5rem 0' }}>
          이 모달이 보인다면 클릭 이벤트는 정상적으로 작동하고 있습니다.
        </p>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: '#ff2736',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
