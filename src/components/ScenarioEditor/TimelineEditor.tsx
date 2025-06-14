import React, { useState, useRef } from 'react';
import type { Scenario, PlayerAction } from '../../types/scenario';
import './TimelineEditor.css';

interface TimelineEditorProps {
  scenario: Scenario;
  onTimeChange: (time: number) => void;
  onActionUpdate: (actionId: string, updates: Partial<PlayerAction>) => void;
  onActionDelete: (actionId: string) => void;
}

const TimelineEditor: React.FC<TimelineEditorProps> = ({
  scenario,
  onTimeChange,
  onActionUpdate,
  onActionDelete
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragActionId, setDragActionId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  
  const duration = scenario.timeline.duration;
  const currentTime = scenario.timeline.currentTime;

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const timelineWidth = rect.width - 80;
    const clickRatio = Math.max(0, Math.min(1, (clickX - 40) / timelineWidth));
    const newTime = clickRatio * duration;
    
    onTimeChange(newTime);
  };

  const handleActionDragStart = (actionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDragging(true);
    setDragActionId(actionId);
  };

  const actionsByPlayer = scenario.players.reduce((acc, player) => {
    acc[player.id] = scenario.actions
      .filter(action => action.playerId === player.id)
      .sort((a, b) => a.timestamp - b.timestamp);
    return acc;
  }, {} as Record<string, PlayerAction[]>);

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

  return (
    <div className="timeline-editor">
      <div className="timeline-header">
        <h3>타임라인</h3>
        <div className="timeline-controls">
          <button
            className="zoom-button"
            onClick={() => setScale(Math.max(0.5, scale - 0.25))}
          >
            🔍-
          </button>
          <span className="scale-indicator">{Math.round(scale * 100)}%</span>
          <button
            className="zoom-button"
            onClick={() => setScale(Math.min(3, scale + 0.25))}
          >
            🔍+
          </button>
        </div>
      </div>

      <div 
        className="timeline-container" 
        ref={timelineRef}
        onClick={handleTimelineClick}
        style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
      >
        <div className="timeline-ruler">
          {Array.from({ length: Math.floor(duration / 10000) + 1 }, (_, i) => {
            const time = i * 10000;
            const position = (time / duration) * 100;
            return (
              <div
                key={i}
                className="time-marker"
                style={{ left: `${40 + position * (100 - 80) / 100}px` }}
              >
                <div className="time-line"></div>
                <span className="time-label">{formatTime(time)}</span>
              </div>
            );
          })}
        </div>

        <div
          className="current-time-indicator"
          style={{
            left: `${40 + (currentTime / duration) * (100 - 80)}%`
          }}
        >
          <div className="time-line current"></div>
          <div className="time-handle"></div>
        </div>

        <div className="timeline-tracks">
          {scenario.players.map((player) => (
            <div key={player.id} className="timeline-track">
              <div className="track-header">
                <div 
                  className="player-indicator"
                  style={{ backgroundColor: player.color }}
                ></div>
                <span className="player-name">{player.agent}</span>
              </div>
              
              <div className="track-content">
                {actionsByPlayer[player.id]?.map(action => {
                  const position = (action.timestamp / duration) * 100;
                  return (
                    <div
                      key={action.id}
                      className={`action-marker ${dragActionId === action.id ? 'dragging' : ''}`}
                      style={{
                        left: `${40 + position * (100 - 80) / 100}px`,
                        backgroundColor: getActionColor(action.type)
                      }}
                      onMouseDown={(e) => handleActionDragStart(action.id, e)}
                      title={`${action.type} at ${formatTime(action.timestamp)}`}
                    >
                      <span className="action-icon">{getActionIcon(action.type)}</span>
                      <div className="action-tooltip">
                        <div>{action.type}</div>
                        <div>{formatTime(action.timestamp)}</div>
                        <button
                          className="delete-action"
                          onClick={(e) => {
                            e.stopPropagation();
                            onActionDelete(action.id);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="timeline-grid">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="grid-line"
              style={{ left: `${40 + (i * 5)}%` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="timeline-info">
        <div className="duration-info">
          총 시간: {formatTime(duration)} | 현재: {formatTime(currentTime)}
        </div>
        <div className="actions-count">
          총 액션: {scenario.actions.length}개
        </div>
      </div>
    </div>
  );
};

export default TimelineEditor;
