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
}) => {
  const attackers = players.filter(p => p.team === 'attack');
  const defenders = players.filter(p => p.team === 'defense');

  const renderPlayerList = (teamPlayers: Player[], teamName: string) => (
    <div className="team-section">
      <h3 className={`team-title ${teamName.toLowerCase()}`}>{teamName}</h3>
      <div className="players-list">
        {teamPlayers.map(player => (
          <div
            key={player.id}
            className={`player-item ${selectedPlayerId === player.id ? 'selected' : ''}`}
            onClick={() => onPlayerSelect(player.id)}
            style={{ borderLeftColor: player.color }}
          >
            <div className="player-info">
              <div className="player-agent">{player.agent}</div>
              <div className="player-name">{player.name}</div>
            </div>
            <div 
              className="player-color-indicator"
              style={{ backgroundColor: player.color }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="player-panel">
      <h2>플레이어</h2>
      {renderPlayerList(attackers, '공격팀')}
      {renderPlayerList(defenders, '수비팀')}
      
      {selectedPlayerId && (
        <div className="selected-player-info">
          <h4>선택된 플레이어</h4>
          <p>{players.find(p => p.id === selectedPlayerId)?.name}</p>
          <button 
            className="deselect-button"
            onClick={() => onPlayerSelect(null)}
          >
            선택 해제
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerPanel;
