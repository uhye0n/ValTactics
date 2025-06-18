import React from 'react';
import type { Player } from '../../types/scenario';
import './ActionSelectionPanel.css';

interface ActionSelectionPanelProps {
  selectedPlayer: Player | null;
  selectedAction: string | null;
  onActionSelect: (actionType: string) => void;
}

const ActionSelectionPanel: React.FC<ActionSelectionPanelProps> = ({
  selectedPlayer,
  selectedAction,
  onActionSelect
}) => {
  if (!selectedPlayer) {
    return (
      <div className="action-selection-panel">
        <div className="no-player-selected">
          <p>먼저 플레이어를 선택해주세요</p>
        </div>
      </div>
    );
  }

  const actionCategories = [
    {
      name: '이동',
      icon: '🚶',
      actions: [
        { id: 'move', name: '이동', icon: '🚶', color: '#4ecdc4' },
        { id: 'crouch_move', name: '숨어서 이동', icon: '🦆', color: '#26d0ce' },
        { id: 'run', name: '달리기', icon: '🏃', color: '#1dd1a1' }
      ]
    },
    {
      name: '스킬',
      icon: '⚡',
      actions: [
        { id: 'ability_1', name: 'Q 스킬', icon: 'Q', color: '#feca57' },
        { id: 'ability_2', name: 'E 스킬', icon: 'E', color: '#ff9ff3' },
        { id: 'ability_3', name: 'C 스킬', icon: 'C', color: '#ff6b6b' }, // 파란색에서 붉은색으로 변경
        { id: 'ultimate', name: '궁극기 (X)', icon: 'X', color: '#ee5a24' }
      ]
    },
    {
      name: '전투',
      icon: '🎯',
      actions: [
        { id: 'shoot', name: '사격', icon: '🎯', color: '#ff6b6b' },
        { id: 'aim', name: '조준', icon: '🔍', color: '#ffa726' },
        { id: 'reload', name: '재장전', icon: '🔄', color: '#66bb6a' },
        { id: 'melee', name: '근접 공격', icon: '🗡️', color: '#ab47bc' }
      ]
    },
    {
      name: '특수',
      icon: '🛠️',
      actions: [
        { id: 'plant', name: '스파이크 설치', icon: '💣', color: '#f44336' },
        { id: 'defuse', name: '스파이크 해체', icon: '🔧', color: '#ff4757' }, // 파란색에서 붉은색으로 변경
        { id: 'peek', name: '피킹', icon: '👁️', color: '#ff9800' },
        { id: 'hide', name: '숨기', icon: '🫥', color: '#607d8b' }
      ]
    }
  ];

  return (
    <div className="action-selection-panel">
      <div className="selected-player-info">
        <div className="player-avatar" style={{ backgroundColor: selectedPlayer.color }}>
          {selectedPlayer.agent.charAt(0)}
        </div>
        <div className="player-details">
          <h3>{selectedPlayer.name}</h3>
          <p>{selectedPlayer.agent}</p>
        </div>
      </div>

      <div className="action-categories">
        {actionCategories.map(category => (
          <div key={category.name} className="action-category">
            <div className="category-header">
              <span className="category-icon">{category.icon}</span>
              <h4 className="category-name">{category.name}</h4>
            </div>
            
            <div className="actions-grid">
              {category.actions.map(action => (
                <button
                  key={action.id}
                  className={`action-button ${selectedAction === action.id ? 'selected' : ''}`}
                  onClick={() => onActionSelect(action.id)}
                  style={{ 
                    '--action-color': action.color,
                    backgroundColor: selectedAction === action.id ? action.color : 'transparent',
                    borderColor: action.color 
                  } as React.CSSProperties}
                >
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-name">{action.name}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedAction && (
        <div className="action-instructions">
          <p>맵에서 위치를 클릭하여 액션을 추가하세요</p>
        </div>
      )}
    </div>
  );
};

export default ActionSelectionPanel;
