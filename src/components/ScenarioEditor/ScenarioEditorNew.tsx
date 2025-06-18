import React, { useState } from 'react';
import { useScenario } from '../../contexts/ScenarioContext';
import type { Player, Position } from '../../types/scenario';
import MapCanvas from './MapCanvas';
import TimelineEditor from './TimelineEditor';
import PlayerPanel from './PlayerPanel';
import ActionSelectionPanel from './ActionSelectionPanel';
import PlaybackControls from './PlaybackControls';
import './ScenarioEditorComplete.css';

export const ScenarioEditor: React.FC = () => {
  const { currentScenario } = useScenario();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rightPanelMode, setRightPanelMode] = useState<'players' | 'actions'>('players');

  const handlePlayerSelect = (playerId: string | null) => {
    setSelectedPlayerId(playerId);
    if (playerId) {
      setRightPanelMode('actions'); // 플레이어 선택 후 액션 패널로 전환
    }
  };

  const handleActionSelect = (actionType: string) => {
    setSelectedAction(actionType);
  };

  const handleMapClick = (position: Position) => {
    if (selectedPlayerId && selectedAction && currentScenario) {
      // 액션 추가 로직은 나중에 구현
      console.log('Action added:', { playerId: selectedPlayerId, action: selectedAction, position });
      
      // 액션 추가 후 다시 플레이어 선택 모드로
      setSelectedAction(null);
      setRightPanelMode('players');
    }
  };

  const selectedPlayer = selectedPlayerId 
    ? currentScenario?.players.find(p => p.id === selectedPlayerId) || null
    : null;

  if (!currentScenario) {
    return (
      <div className="scenario-editor-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>시나리오를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scenario-editor">
      <div className="scenario-editor-background"></div>
      
      <div className="scenario-editor-content">
        {/* 상단 헤더 */}
        <div className="scenario-editor-header">
          <h1 className="editor-title">시나리오 에디터</h1>
          <div className="scenario-info">
            <div className="info-item">
              <span className="info-label">맵</span>
              <span className="info-value">{currentScenario.title}</span>
            </div>
            <div className="info-item">
              <span className="info-label">플레이어</span>
              <span className="info-value">{currentScenario.players.length}</span>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="editor-main-container">
          {/* 왼쪽: 맵 영역 */}
          <div className="editor-map-section">
            <div className="map-container">
              <MapCanvas
                scenario={currentScenario}
                onMapClick={handleMapClick}
              />
            </div>
            
            {/* 하단 타임라인 */}
            <div className="timeline-section">
              <TimelineEditor
                scenario={currentScenario}
                onTimeChange={setCurrentTime}
              />
              
              <PlaybackControls
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={120}
                playbackSpeed={1.0}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onStop={() => {
                  setIsPlaying(false);
                  setCurrentTime(0);
                }}
                onSeek={setCurrentTime}
              />
            </div>
          </div>

          {/* 오른쪽: 선택 패널 */}
          <div className="editor-right-panel">
            <div className="panel-header">
              <div className="panel-tabs">
                <button 
                  className={`tab-button ${rightPanelMode === 'players' ? 'active' : ''}`}
                  onClick={() => setRightPanelMode('players')}
                >
                  플레이어 선택
                </button>
                <button 
                  className={`tab-button ${rightPanelMode === 'actions' ? 'active' : ''}`}
                  onClick={() => setRightPanelMode('actions')}
                  disabled={!selectedPlayerId}
                >
                  액션 선택
                </button>
              </div>
            </div>

            <div className="panel-content">
              {rightPanelMode === 'players' ? (
                <PlayerPanel
                  players={currentScenario.players}
                  selectedPlayerId={selectedPlayerId}
                  onPlayerSelect={handlePlayerSelect}
                />
              ) : (
                <ActionSelectionPanel
                  selectedPlayer={selectedPlayer}
                  selectedAction={selectedAction}
                  onActionSelect={handleActionSelect}
                />
              )}
            </div>

            {/* 선택 상태 표시 */}
            <div className="selection-status">
              {selectedPlayer && (
                <div className="selected-player">
                  <span className="status-label">선택된 플레이어:</span>
                  <span className="status-value">{selectedPlayer.name}</span>
                </div>
              )}
              {selectedAction && (
                <div className="selected-action">
                  <span className="status-label">선택된 액션:</span>
                  <span className="status-value">{selectedAction}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioEditor;

export default ScenarioEditor;
