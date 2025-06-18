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
}) => {  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragActionId, setDragActionId] = useState<string | null>(null);
    const duration = scenario.timeline?.duration || 30000; // 기본 30초
  const currentTime = 0; // 현재 시간은 props로 받거나 상태로 관리해야 함

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
  const actionsByPlayer = scenario.teams?.reduce((acc, team) => {
    const events = scenario.timeline?.events?.filter(event => {
      try {
        const eventData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        return eventData?.playerId === team.id;
      } catch {
        return false;
      }
    }) || [];
    
    acc[team.id] = events.sort((a, b) => a.timestamp - b.timestamp);
    return acc;
  }, {} as Record<string, any[]>) || {};
  const getActionColor = (type: string) => {
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

  const getActionIcon = (type: string) => {
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

        <div className="timeline-tracks">          {scenario.teams?.map((team) => (
            <div key={team.id} className="timeline-track">              <div className="track-header">
                <div 
                  className="player-indicator"
                  style={{ 
                    backgroundColor: 'transparent',
                    border: `2px solid ${team.teamType === 'our' ? '#00BFFF' : '#F44336'}`,
                    padding: '2px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img 
                    src={`/resources/images/agent/${team.agentName}.png`}
                    alt={team.agentName}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      // 이미지 로드 실패 시 텍스트로 대체
                      e.currentTarget.style.display = 'none';
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.style.cssText = 'font-size: 10px; color: white; text-align: center; font-weight: bold;';
                      fallbackDiv.textContent = team.agentName.substring(0, 2).toUpperCase();
                      e.currentTarget.parentNode?.appendChild(fallbackDiv);
                    }}
                  />
                </div>
              </div>
                <div className="track-content">                {actionsByPlayer[team.id]?.map(event => {
                  const position = (event.timestamp / duration) * 100;
                  return (
                    <div
                      key={event.id}
                      className={`action-marker ${dragActionId === event.id ? 'dragging' : ''}`}
                      style={{
                        left: `${40 + position * (100 - 80) / 100}px`,
                        backgroundColor: getActionColor(event.eventType || 'unknown')
                      }}
                      onMouseDown={(e) => handleActionDragStart(event.id, e)}
                      title={`${event.eventType} at ${formatTime(event.timestamp)}`}
                    >
                      <span className="action-icon">{getActionIcon(event.eventType || 'unknown')}</span>
                      <div className="action-tooltip">
                        <div>{event.eventType}</div>
                        <div>{formatTime(event.timestamp)}</div>
                        <button
                          className="delete-action"
                          onClick={(e) => {
                            e.stopPropagation();
                            onActionDelete(event.id);
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
              style={{ left: `${40 + (i * 5)}%` }}            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineEditor;
