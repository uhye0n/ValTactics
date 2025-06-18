import React, { useState } from 'react';
import type { Player, PlayerAction } from '../../types/scenario';
import { AGENT_SKILLS } from '../../constants/valorant';
import './RightPanel.css';

interface RightPanelProps {
  selectedPlayer: Player | null;
  selectedTool: 'select' | 'move' | 'skill' | 'shoot';
  onToolChange: (tool: 'select' | 'move' | 'skill' | 'shoot') => void;
  onSkillSelect: (skillId: string) => void;
  currentTime: number;
  onAddAction: (action: Omit<PlayerAction, 'id'>) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  selectedPlayer,
  selectedTool,
  onToolChange,
  onSkillSelect,
  currentTime,
  onAddAction
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const handleSkillClick = (skillId: string) => {
    setSelectedSkill(skillId);
    onSkillSelect(skillId);
    onToolChange('skill');
  };

  const handleQuickAction = (actionType: 'plant' | 'defuse' | 'death') => {
    if (!selectedPlayer) return;
    
    onAddAction({
      playerId: selectedPlayer.id,
      timestamp: currentTime,
      type: actionType,
      position: { x: 0.5, y: 0.5 }, // 기본 위치
      data: {}
    });
  };

  const getPlayerSkills = () => {
    if (!selectedPlayer || !selectedPlayer.agent) return [];
    return AGENT_SKILLS[selectedPlayer.agent as keyof typeof AGENT_SKILLS] || [];
  };

  return (
    <div className="right-panel">
      {/* 도구 선택 */}
      <div className="tool-section">
        <h3>도구</h3>
        <div className="tool-grid">
          <button 
            className={`tool-btn ${selectedTool === 'select' ? 'active' : ''}`}
            onClick={() => onToolChange('select')}
          >
            <span className="tool-icon">👆</span>
            <span>선택</span>
          </button>
          <button 
            className={`tool-btn ${selectedTool === 'move' ? 'active' : ''}`}
            onClick={() => onToolChange('move')}
          >
            <span className="tool-icon">🚶</span>
            <span>이동</span>
          </button>
          <button 
            className={`tool-btn ${selectedTool === 'skill' ? 'active' : ''}`}
            onClick={() => onToolChange('skill')}
          >
            <span className="tool-icon">⚡</span>
            <span>스킬</span>
          </button>
          <button 
            className={`tool-btn ${selectedTool === 'shoot' ? 'active' : ''}`}
            onClick={() => onToolChange('shoot')}
          >
            <span className="tool-icon">🎯</span>
            <span>사격</span>
          </button>
        </div>
      </div>

      {/* 선택된 플레이어 정보 */}
      {selectedPlayer && (
        <div className="player-section">
          <h3>선택된 플레이어</h3>
          <div className="player-info-card">
            <div 
              className="player-avatar"
              style={{ 
                backgroundColor: selectedPlayer.color,
                border: `3px solid ${selectedPlayer.team === 'attack' ? '#ff6b6b' : '#4ecdc4'}`
              }}
            >
              <span className="player-initial">
                {selectedPlayer.agent.charAt(0)}
              </span>
            </div>
            <div className="player-details">
              <div className="player-agent">{selectedPlayer.agent}</div>
              <div className="player-name">{selectedPlayer.name}</div>
              <div className={`player-team ${selectedPlayer.team}`}>
                {selectedPlayer.team === 'attack' ? '공격팀' : '수비팀'}
              </div>
            </div>
          </div>

          {/* 스킬 선택 */}
          <div className="skills-section">
            <h4>스킬</h4>
            <div className="skills-grid">
              {getPlayerSkills().map((skill) => (
                <button
                  key={skill.id}
                  className={`skill-btn ${selectedSkill === skill.id ? 'active' : ''}`}
                  onClick={() => handleSkillClick(skill.id)}
                  title={skill.description}
                >                  <div className="skill-icon">
                    <img 
                      src={skill.icon} 
                      alt={skill.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <span className="skill-fallback" style={{ display: 'none' }}>
                      {skill.type === 'ultimate' ? '🔥' : skill.type === 'signature' ? '⭐' : '⚡'}
                    </span>
                  </div>
                  <div className="skill-info">
                    <div className="skill-name">{skill.name}</div>
                    <div className={`skill-type ${skill.type}`}>
                      {skill.type === 'ultimate' ? 'ULT' : 
                       skill.type === 'signature' ? 'SIG' : 'BASIC'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 빠른 액션 */}
          <div className="quick-actions-section">
            <h4>빠른 액션</h4>
            <div className="quick-actions-grid">
              <button 
                className="quick-action-btn plant"
                onClick={() => handleQuickAction('plant')}
              >
                <span className="action-icon">💣</span>
                <span>스파이크 설치</span>
              </button>
              <button 
                className="quick-action-btn defuse"
                onClick={() => handleQuickAction('defuse')}
              >
                <span className="action-icon">🔧</span>
                <span>스파이크 해제</span>
              </button>
              <button 
                className="quick-action-btn death"
                onClick={() => handleQuickAction('death')}
              >
                <span className="action-icon">💀</span>
                <span>사망</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 플레이어가 선택되지 않았을 때 */}
      {!selectedPlayer && (
        <div className="no-player-section">
          <div className="no-player-message">
            <span className="no-player-icon">👆</span>
            <h4>플레이어를 선택하세요</h4>
            <p>맵에서 플레이어를 클릭하여 선택하고<br />액션을 추가할 수 있습니다.</p>
          </div>
        </div>
      )}

      {/* 현재 시간 정보 */}
      <div className="time-section">
        <h4>현재 시간</h4>
        <div className="time-display">
          {Math.floor(currentTime / 1000)}초
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
