import React, { useState } from 'react';
import { useScenario } from '../../contexts/ScenarioContext';
import type { Player, Position } from '../../types/scenario';
import MapCanvas from './MapCanvas';
import TimelineEditor from './TimelineEditor';
import PlayerPanel from './PlayerPanel';
import ActionSelectionPanel from './ActionSelectionPanel';
import PlaybackControls from './PlaybackControls';
import './ScenarioEditorComplete.css';

const ScenarioEditor: React.FC = () => {
  const { currentScenario } = useScenario();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rightPanelMode, setRightPanelMode] = useState<'players' | 'actions'>('players');

  // 테스트용 더미 시나리오 데이터
  const dummyScenario = {
    id: 'test-scenario',
    title: 'ASCENT',
    description: '테스트 시나리오',
    mapId: 'ascent',
    createdBy: 'test-user',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false,
    tags: [],
    players: [
      {
        id: 'player-1',
        name: 'Jett',
        agent: 'Jett',
        team: 'attack' as const,
        color: '#00d4ff'
      },
      {
        id: 'player-2', 
        name: 'Sage',
        agent: 'Sage',
        team: 'attack' as const,
        color: '#7fff00'
      },
      {
        id: 'player-3',
        name: 'Omen',
        agent: 'Omen', 
        team: 'defense' as const,
        color: '#9d4edd'
      },
      {
        id: 'player-4',
        name: 'Cypher',
        agent: 'Cypher',
        team: 'defense' as const,
        color: '#ffd60a'
      }
    ],
    actions: [],
    timeline: {
      duration: 120000,
      currentTime: 0,
      isPlaying: false,
      playbackSpeed: 1.0
    },
    metadata: {
      roundType: 'full-buy' as const,
      gameMode: 'competitive' as const
    }
  };

  // currentScenario가 없으면 더미 데이터 사용
  const scenario = currentScenario || dummyScenario;

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
    if (selectedPlayerId && selectedAction && scenario) {
      // 액션 추가 로직은 나중에 구현
      console.log('Action added:', { playerId: selectedPlayerId, action: selectedAction, position });
      
      // 액션 추가 후 다시 플레이어 선택 모드로
      setSelectedAction(null);
      setRightPanelMode('players');
    }
  };
  const selectedPlayer = selectedPlayerId 
    ? scenario?.players.find(p => p.id === selectedPlayerId) || null
    : null;

  // 로딩 상태는 제거 (더미 데이터가 있으므로 항상 시나리오가 존재)
  
  return (
    <div className="scenario-editor">
      <div className="scenario-editor-background"></div>
      
      {/* Header는 App.tsx에서 렌더링되므로 여기서는 제거 */}
      
      <div className="scenario-editor-content">
        {/* 상단 헤더 */}
        <div className="scenario-editor-header">
          <h1 className="editor-title">시나리오 에디터</h1><div className="scenario-info">
            <div className="info-item">
              <span className="info-label">맵</span>
              <span className="info-value">{scenario.title}</span>
            </div>
            <div className="info-item">
              <span className="info-label">플레이어</span>
              <span className="info-value">{scenario.players.length}</span>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="editor-main-container">
          {/* 왼쪽: 맵 영역 */}
          <div className="editor-map-section">
            <div className="map-container">
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px' }}>
                맵 캔버스 (개발 중)
              </div>
            </div>
            
            {/* 하단 타임라인 */}
            <div className="timeline-section">
              <div style={{ color: '#fff', padding: '10px' }}>타임라인 에디터 (개발 중)</div>
              
              <div style={{ color: '#fff', padding: '10px' }}>재생 컨트롤 (개발 중)</div>
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
            </div>            <div className="panel-content">
              {rightPanelMode === 'players' ? (
                <PlayerPanel
                  players={scenario.players}
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
