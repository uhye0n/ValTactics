import React from 'react';
import type { Player } from '../../types/scenario';
import './ActionSelectionPanel.css';

interface ActionSelectionPanelProps {
  selectedPlayer: Player | null;
  selectedAction: string | null;
  onActionSelect: (actionType: string) => void;
  actionMode: string;
  onActionModeChange: (mode: 'select' | 'move' | 'run' | 'skill') => void;
}

const ActionSelectionPanel: React.FC<ActionSelectionPanelProps> = ({
  selectedPlayer,
  selectedAction,
  onActionSelect,
  actionMode,
  onActionModeChange
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

  const quickActions = [
    { id: 'move', name: '걷기', icon: '🚶', color: '#00BFFF' },
    { id: 'run', name: '달리기', icon: '🏃', color: '#FFA500' },
    { id: 'skill_q', name: 'Q 스킬', icon: 'Q', color: '#FF69B4' },
    { id: 'skill_e', name: 'E 스킬', icon: 'E', color: '#FF69B4' },
    { id: 'skill_c', name: 'C 스킬', icon: 'C', color: '#FF69B4' },
    { id: 'skill_x', name: '궁극기', icon: 'X', color: '#FF0000' },
    { id: 'plant', name: '스파이크 설치', icon: '💣', color: '#32CD32' },
    { id: 'defuse', name: '스파이크 해체', icon: '🛡️', color: '#1E90FF' }
  ];

  const handleActionClick = (actionId: string) => {
    if (actionId === 'move' || actionId === 'run') {
      onActionModeChange(actionId as 'move' | 'run');
    } else if (actionId.startsWith('skill_')) {
      onActionModeChange('skill');
      onActionSelect(actionId);
    } else {
      onActionSelect(actionId);
    }
  };

  return (
    <div className="action-selection-panel">
      <div className="selected-player-info">
        <div className="player-avatar">
          <img 
            src={`/resources/images/agent/${selectedPlayer.agent}.png`}
            alt={selectedPlayer.agent}
            onError={(e) => {
              e.currentTarget.src = '/resources/images/agent/default.png';
            }}
          />
        </div>
        <div className="player-details">
          <h3>{selectedPlayer.name}</h3>
          <p>{selectedPlayer.agent} - {selectedPlayer.role}</p>
        </div>
      </div>

      <div className="quick-actions">
        <h4>빠른 액션</h4>
        <div className="action-grid">
          {quickActions.map((action) => {
            const isActive = (action.id === 'move' && actionMode === 'move') ||
                           (action.id === 'run' && actionMode === 'run') ||
                           (action.id.startsWith('skill_') && actionMode === 'skill' && selectedAction === action.id);
            
            return (
              <button
                key={action.id}
                className={`quick-action-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleActionClick(action.id)}
                style={{
                  backgroundColor: isActive ? action.color : 'rgba(255, 255, 255, 0.1)',
                  borderColor: action.color,
                  color: isActive ? 'white' : action.color
                }}
                title={action.name}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-name">{action.name}</span>
              </button>
            );
          })}        </div>
      </div>
    </div>
  );
};

export default ActionSelectionPanel;
