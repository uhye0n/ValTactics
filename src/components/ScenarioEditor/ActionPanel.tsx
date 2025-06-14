import React from 'react';
import type { PlayerAction } from '../../types/scenario';
import './ActionPanel.css';

interface ActionPanelProps {
  actions: PlayerAction[];
  currentTime: number;
  onActionUpdate: (actionId: string, updates: Partial<PlayerAction>) => void;
  onActionDelete: (actionId: string) => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  actions,
  currentTime,
  onActionUpdate,
  onActionDelete
}) => {
  // 현재 시간 기준으로 액션 정렬
  const sortedActions = [...actions].sort((a, b) => a.timestamp - b.timestamp);
  
  // 현재 시간 근처의 액션들만 표시 (±5초)
  const timeWindow = 5000; // 5초
  const visibleActions = sortedActions.filter(action => 
    Math.abs(action.timestamp - currentTime) <= timeWindow
  );

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor(timestamp / 1000);
    const ms = Math.floor((timestamp % 1000) / 10);
    return `${seconds}.${ms.toString().padStart(2, '0')}s`;
  };

  const getActionIcon = (type: PlayerAction['type']) => {
    switch (type) {
      case 'move': return '🚶';
      case 'skill': return '⚡';
      case 'shoot': return '🎯';
      case 'plant': return '💣';
      case 'defuse': return '🔧';
      case 'death': return '💀';
      case 'revive': return '❤️';
      default: return '❓';
    }
  };

  const getActionColor = (type: PlayerAction['type']) => {
    switch (type) {
      case 'move': return '#4ecdc4';
      case 'skill': return '#ffe66d';
      case 'shoot': return '#ff6b6b';
      case 'plant': return '#ff9f43';
      case 'defuse': return '#0abde3';
      case 'death': return '#ff3838';
      case 'revive': return '#00d2d3';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="action-panel">
      <h2>액션 목록</h2>
      
      <div className="current-time-info">
        <span>현재 시간: {formatTime(currentTime)}</span>
      </div>

      <div className="actions-list">
        {visibleActions.length === 0 ? (
          <div className="no-actions">
            현재 시간 근처에 액션이 없습니다.
          </div>
        ) : (
          visibleActions.map(action => (
            <div
              key={action.id}
              className={`action-item ${Math.abs(action.timestamp - currentTime) < 500 ? 'current' : ''}`}
              style={{ borderLeftColor: getActionColor(action.type) }}
            >
              <div className="action-header">
                <span className="action-icon">{getActionIcon(action.type)}</span>
                <span className="action-type">{action.type}</span>
                <span className="action-time">{formatTime(action.timestamp)}</span>
              </div>
              
              <div className="action-details">
                <div className="action-position">
                  위치: ({Math.round(action.position.x)}, {Math.round(action.position.y)})
                </div>
                
                {action.data?.skillId && (
                  <div className="action-skill">
                    스킬: {action.data.skillId}
                  </div>
                )}
                
                {action.data?.weapon && (
                  <div className="action-weapon">
                    무기: {action.data.weapon}
                  </div>
                )}
                
                {action.data?.notes && (
                  <div className="action-notes">
                    메모: {action.data.notes}
                  </div>
                )}
              </div>

              <div className="action-controls">
                <button
                  className="edit-button"
                  onClick={() => {
                    const newTimestamp = prompt('새 시간 (밀리초):', action.timestamp.toString());
                    if (newTimestamp) {
                      onActionUpdate(action.id, { timestamp: parseInt(newTimestamp, 10) });
                    }
                  }}
                  title="시간 수정"
                >
                  ⏰
                </button>
                
                <button
                  className="delete-button"
                  onClick={() => {
                    if (confirm('이 액션을 삭제하시겠습니까?')) {
                      onActionDelete(action.id);
                    }
                  }}
                  title="삭제"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="actions-summary">
        <small>
          전체 액션: {actions.length}개 | 
          표시된 액션: {visibleActions.length}개
        </small>
      </div>
    </div>
  );
};

export default ActionPanel;
