import React from 'react';
import type { Player } from '../../types/scenario';
import './PlayerPanel.css';

interface PlayerPanelProps {
  players: Player[];
  selectedPlayerId: string | null;
  onPlayerSelect: (playerId: string | null) => void;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({
  players,
  selectedPlayerId,
  onPlayerSelect
}) => {  const ourTeam = players.filter(p => p.team === 'our');
  const enemyTeam = players.filter(p => p.team === 'enemy');
  const renderPlayerList = (teamPlayers: Player[], teamName: string, teamType: string) => (
    <div className="team-section">
      <h3 className={`team-title ${teamType}`}>{teamName}</h3>
      <div className="players-list">
        {teamPlayers.map(player => (
          <div
            key={player.id}
            className={`player-item ${selectedPlayerId === player.id ? 'selected' : ''}`}
            onClick={() => onPlayerSelect(selectedPlayerId === player.id ? null : player.id)}
            style={{ borderLeftColor: player.team === 'our' ? '#00BFFF' : '#F44336' }}
          >
            <div className="player-avatar">
              <img 
                src={`/resources/images/agent/${getAgentImageName(player.agent)}.png`}
                alt={player.agent}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `2px solid ${player.team === 'our' ? '#00BFFF' : '#F44336'}`
                }}
                onError={(e) => {
                  // 이미지 로드 실패 시 텍스트로 대체
                  e.currentTarget.style.display = 'none';
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.style.cssText = `
                    width: 32px; 
                    height: 32px; 
                    border-radius: 50%; 
                    background: ${player.team === 'our' ? '#00BFFF' : '#F44336'}; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 12px; 
                    color: white; 
                    font-weight: bold;
                  `;
                  fallbackDiv.textContent = player.agent.substring(0, 2).toUpperCase();
                  e.currentTarget.parentNode?.appendChild(fallbackDiv);
                }}
              />
            </div>
            <div className="player-info">
              <div className="player-agent">{player.agent}</div>
              <div className="player-name">{player.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="player-panel">      <h2>플레이어</h2>      {renderPlayerList(ourTeam, '아군팀', 'our')}
      {renderPlayerList(enemyTeam, '적군팀', 'enemy')}
    </div>
  );
};

// 요원 이름을 이미지 파일명으로 변환하는 함수
const getAgentImageName = (agentName: string): string => {
  if (agentName === 'KAY/O') {
    return 'Kayo';
  }
  return agentName;
};

export default PlayerPanel;
