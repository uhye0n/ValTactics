import React, { useState, useRef } from 'react';
import type { Scenario, PlayerAction } from '../../types/scenario';
import './TimelineEditor.css';

interface TimelineEditorProps {
  scenario: Scenario;
  currentTime?: number;
  onTimeChange: (time: number) => void;
  onActionUpdate: (actionId: string, updates: Partial<PlayerAction>) => void;
  onActionDelete: (actionId: string) => void;
}

const TimelineEditor: React.FC<TimelineEditorProps> = ({
  scenario,
  currentTime = 0,
  onTimeChange,
  onActionUpdate,
  onActionDelete
}) => {  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragActionId, setDragActionId] = useState<string | null>(null);
  const duration = scenario.timeline?.duration || 100000; // 기본 1분 40초
  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 요원 이름을 이미지 파일명으로 변환하는 함수
  const getAgentImageName = (agentName: string) => {
    if (agentName === 'KAY/O') {
      return 'Kayo';
    }
    return agentName;
  };const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const timelineWidth = rect.width;
    const leftPadding = 80; // 플레이어 헤더 공간을 80px로 조정
    const rightPadding = 20; // 오른쪽 여백 줄임
    const activeWidth = timelineWidth - leftPadding - rightPadding;
    
    // 클릭 위치가 활성 영역 내에 있는지 확인
    if (clickX < leftPadding || clickX > timelineWidth - rightPadding) return;
    
    const clickRatio = (clickX - leftPadding) / activeWidth;
    const newTime = Math.max(0, Math.min(duration, clickRatio * duration));
    
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
        // 데이터 파싱을 더 안전하게 처리
        let eventData;
        if (typeof event.data === 'string') {
          try {
            eventData = JSON.parse(event.data);
          } catch (parseError) {
            console.warn('Failed to parse event data:', event.data);
            return false;
          }
        } else if (typeof event.data === 'object') {
          eventData = event.data;
        } else {
          console.warn('Invalid event data type:', typeof event.data);
          return false;
        }
        
        // playerId 확인 (중첩된 객체 구조 고려)
        const playerId = eventData?.playerId || eventData?.metadata?.playerId || eventData?.teamCompositionId;
        return playerId === team.id;
      } catch (error) {
        console.warn('Error processing event:', error, event);
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
      >        <div className="timeline-ruler">
          {Array.from({ length: 11 }, (_, i) => { // 0초부터 100초까지 10초 간격 (11개 마커)
            const time = i * 10000; // 10초 간격 (10000ms)
            const position = (time / duration) * 100;
            return (
              <div
                key={i}
                className="time-marker"
                style={{ left: `${position}%` }}
              >
                <div className="time-line"></div>
                <span className="time-label">{formatTime(time)}</span>
              </div>
            );
          })}
          
          {/* 현재 시간 표시기를 룰러 내부로 이동 */}
          <div
            className="current-time-indicator"
            style={{
              left: `${(currentTime / duration) * 100}%`
            }}
          >
            <div className="time-line current"></div>
            <div className="time-handle"></div>          </div>
        </div>

        <div className="timeline-tracks">{scenario.teams?.map((team) => (
            <div key={team.id} className="timeline-track">              <div className="track-header">                <div 
                  className="player-indicator"
                  style={{ 
                    backgroundColor: 'transparent',
                    border: `2px solid ${team.teamType === 'our' ? '#00BFFF' : '#F44336'}`,
                    padding: '1px', /* 패딩 줄임 */
                    width: '24px', /* 크기 줄임 */
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >                  <img 
                    src={`/resources/images/agent/${getAgentImageName(team.agentName)}.png`}
                    alt={team.agentName}
                    style={{
                      width: '20px', /* 24px에서 20px로 줄임 */
                      height: '20px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      // 이미지 로드 실패 시 대체 이미지 시도
                      const target = e.currentTarget;
                      if (!target.dataset.retried) {
                        target.dataset.retried = 'true';
                        target.src = `/resources/images/agent/${team.agentName.replace('/', '')}.png`;
                        return;
                      }
                      // 최종 실패 시 텍스트로 대체
                      target.style.display = 'none';
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.style.cssText = 'font-size: 8px; color: white; text-align: center; font-weight: bold;';
                      fallbackDiv.textContent = team.agentName.substring(0, 2).toUpperCase();
                      target.parentNode?.appendChild(fallbackDiv);
                    }}
                  />
                </div>
              </div>
                <div className="track-content">                {actionsByPlayer[team.id]?.map(event => {
                  const position = (event.timestamp / duration) * 100;
                  // 스킬 블록 처리
                  const isSkill = event.eventType === 'skill';
                  let blockWidth = undefined;
                  let durationMs = 0;
                  if (isSkill) {
                    let eventData = {};
                    if (typeof event.data === 'string') {
                      try { eventData = JSON.parse(event.data); } catch {}
                    } else if (typeof event.data === 'object') {
                      eventData = event.data;
                    }
                    durationMs = eventData?.duration || 0;
                    if (durationMs > 0) {
                      blockWidth = (durationMs / duration) * 100;
                    }
                  }
                  return (
                    <div
                      key={event.id}
                      className={`action-marker${isSkill && blockWidth ? ' skill-block' : ''} ${dragActionId === event.id ? 'dragging' : ''}`}
                      style={{
                        left: `${position}%`,
                        width: isSkill && blockWidth ? `${blockWidth}%` : undefined,
                        backgroundColor: getActionColor(event.eventType || 'unknown'),
                      }}
                      onMouseDown={(e) => handleActionDragStart(event.id, e)}
                      onClick={(e) => {
                        // 좌클릭: 해당 시간으로 이동
                        if (e.button === 0) {
                          onTimeChange(event.timestamp);
                        }
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        onActionDelete(event.id);
                      }}
                      title={`${event.eventType} at ${formatTime(event.timestamp)}`}
                    >
                      <span className="action-icon">{getActionIcon(event.eventType || 'unknown')}</span>
                      <div className="action-tooltip">
                        <div>{event.eventType}</div>
                        <div>{formatTime(event.timestamp)}</div>
                        {isSkill && durationMs > 0 && (
                          <div>지속: {Math.round(durationMs/1000)}초</div>
                        )}
                        {/* 삭제 버튼은 숨김 처리 (우클릭으로만 삭제) */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>        <div className="timeline-grid">
          {Array.from({ length: 11 }, (_, i) => ( // 시간 마커와 동일하게 11개
            <div
              key={i}
              className="grid-line"
              style={{ left: `${(i * 10)}%` }} // 10% 간격으로 수정
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineEditor;
