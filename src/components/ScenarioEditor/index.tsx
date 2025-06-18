import React, { useState, useEffect } from 'react';
import { useScenario } from '../../contexts/ScenarioContext';
import { Player, Action, ActionType } from '../../types/scenario';
import { MapCanvas } from './MapCanvas';
import { TimelineEditor } from './TimelineEditor';
import { PlayerPanel } from './PlayerPanel';
import { ActionPanel } from './ActionPanel';
import { PlaybackControls } from './PlaybackControls';
import './ScenarioEditor.css';

export const ScenarioEditor: React.FC = () => {
  const { currentScenario, updateScenario } = useScenario();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rightPanelMode, setRightPanelMode] = useState<'players' | 'actions'>('players');

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setRightPanelMode('actions'); // 플레이어 선택 후 액션 패널로 전환
  };

  const handleActionSelect = (actionType: ActionType) => {
    setSelectedAction(actionType);
  };

  const handleMapClick = (x: number, y: number) => {
    if (selectedPlayer && selectedAction && currentScenario) {
      const newAction: Action = {
        id: `action_${Date.now()}`,
        type: selectedAction,
        playerId: selectedPlayer.id,
        timestamp: currentTime,
        position: { x, y },
        description: `${selectedAction} action by ${selectedPlayer.name}`
      };

      const updatedScenario = {
        ...currentScenario,
        actions: [...currentScenario.actions, newAction]
      };

      updateScenario(updatedScenario);
      
      // 액션 추가 후 다시 플레이어 선택 모드로
      setSelectedAction(null);
      setRightPanelMode('players');
    }
  };

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
              <span className="info-value">{currentScenario.mapName}</span>
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
                mapName={currentScenario.mapName}
                players={currentScenario.players}
                actions={currentScenario.actions}
                currentTime={currentTime}
                onMapClick={handleMapClick}
                selectedPlayer={selectedPlayer}
                selectedAction={selectedAction}
              />
            </div>
            
            {/* 하단 타임라인 */}
            <div className="timeline-section">
              <TimelineEditor
                actions={currentScenario.actions}
                currentTime={currentTime}
                onTimeChange={setCurrentTime}
              />
              
              <PlaybackControls
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={Math.max(...currentScenario.actions.map(a => a.timestamp), 30)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
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
                  disabled={!selectedPlayer}
                >
                  액션 선택
                </button>
              </div>
            </div>

            <div className="panel-content">
              {rightPanelMode === 'players' ? (
                <PlayerPanel
                  players={currentScenario.players}
                  selectedPlayer={selectedPlayer}
                  onPlayerSelect={handlePlayerSelect}
                />
              ) : (
                <ActionPanel
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

interface ScenarioEditorProps {}

const ScenarioEditor: React.FC<ScenarioEditorProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();  const {
    currentScenario, 
    playback, 
    createScenario, 
    loadScenario,
    saveScenario,
    addAction,
    updateAction,
    removeAction,
    play,
    pause,
    stop,
    seekTo,
    setSelectedPlayer
  } = useScenario();
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'select' | 'move' | 'skill' | 'shoot'>('select');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // URL 파라미터에서 시나리오 설정 정보 가져오기
  const mapId = searchParams.get('map');
  const attackers = searchParams.get('attackers')?.split(',') || [];
  const defenders = searchParams.get('defenders')?.split(',') || [];

  // 시나리오 초기화
  useEffect(() => {
    const initializeScenario = async () => {
      if (isInitialized || !mapId) return;

      try {
        // 플레이어 생성
        const players: Player[] = [];
          // 공격팀 플레이어 추가
        attackers.forEach((agent, index) => {
          if (agent && VALORANT_AGENTS.includes(agent as any)) {
            players.push({
              id: `attacker-${index}`,
              name: `Attacker ${index + 1}`,
              agent,
              team: 'attack',
              color: `hsl(${index * 72}, 70%, 50%)` // 각 플레이어별 다른 색상
            });
          }
        });

        // 수비팀 플레이어 추가
        defenders.forEach((agent, index) => {
          if (agent && VALORANT_AGENTS.includes(agent as any)) {
            players.push({
              id: `defender-${index}`,
              name: `Defender ${index + 1}`,
              agent,
              team: 'defense',
              color: `hsl(${(index + 5) * 72}, 70%, 50%)` // 공격팀과 다른 색상
            });
          }
        });

        // 새 시나리오 생성
        const scenario = await createScenario({
          title: `${VALORANT_MAPS.find(m => m.id === mapId)?.name || mapId} 시나리오`,
          mapId,
          players,
          timeline: {
            duration: 120000, // 2분
            currentTime: 0,
            isPlaying: false,
            playbackSpeed: 1.0
          }
        });

        await loadScenario(scenario.id);
        setIsInitialized(true);
      } catch (error) {
        console.error('시나리오 초기화 중 오류:', error);
        navigate('/new-scenario');
      }
    };

    initializeScenario();
  }, [mapId, attackers, defenders, isInitialized, createScenario, loadScenario, navigate]);

  // 스킬 선택 핸들러
  const handleSkillSelect = useCallback((skillId: string) => {
    setSelectedSkill(skillId);
    setSelectedTool('skill');
  }, []);

  // 도구 변경 핸들러
  const handleToolChange = useCallback((tool: 'select' | 'move' | 'skill' | 'shoot') => {
    setSelectedTool(tool);
  }, []);

  // 빠른 액션 추가 핸들러
  const handleAddAction = useCallback((action: Omit<PlayerAction, 'id'>) => {
    addAction(action);
  }, [addAction]);

  // 맵 클릭 핸들러
  const handleMapClick = useCallback((position: Position) => {
    if (!currentScenario || !playback) return;

    const currentTime = playback.currentTime;

    switch (selectedTool) {
      case 'move':
        // 선택된 플레이어를 해당 위치로 이동
        if (selectedPlayerId) {
          addAction({
            playerId: selectedPlayerId,
            timestamp: currentTime,
            type: 'move',
            position
          });
        }
        break;      case 'skill':
        // 스킬 사용 액션 추가
        if (selectedPlayerId) {
          const player = currentScenario.players.find(p => p.id === selectedPlayerId);
          if (player) {
            addAction({
              playerId: selectedPlayerId,
              timestamp: currentTime,
              type: 'skill',
              position,
              data: {
                skillId: selectedSkill || 'basic-skill',
                targetPosition: position
              }
            });
          }
        }
        break;

      case 'shoot':
        // 사격 액션 추가
        if (selectedPlayerId) {
          addAction({
            playerId: selectedPlayerId,
            timestamp: currentTime,
            type: 'shoot',
            position,
            data: {
              weapon: 'rifle' // TODO: 실제 무기 선택
            }
          });
        }
        break;

      default:
        break;
    }
  }, [currentScenario, playback, selectedTool, selectedPlayerId, addAction]);

  // 플레이어 선택 핸들러
  const handlePlayerSelect = useCallback((playerId: string | null) => {
    setSelectedPlayerId(playerId);
    setSelectedPlayer(playerId);
  }, [setSelectedPlayer]);

  // 액션 업데이트 핸들러
  const handleActionUpdate = useCallback((actionId: string, updates: Partial<PlayerAction>) => {
    updateAction(actionId, updates);
  }, [updateAction]);

  // 시나리오 저장
  const handleSave = useCallback(async () => {
    if (currentScenario) {
      try {
        await saveScenario(currentScenario);
        alert('시나리오가 저장되었습니다!');
      } catch (error) {
        console.error('저장 중 오류:', error);
        alert('저장 중 오류가 발생했습니다.');
      }
    }
  }, [currentScenario, saveScenario]);

  if (!isInitialized || !currentScenario || !playback) {
    return (
      <div className="scenario-editor loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>시나리오를 준비 중입니다...</p>
        </div>
      </div>
    );
  }

  const selectedMap = VALORANT_MAPS.find(m => m.id === currentScenario.mapId);

  return (
    <div className="scenario-editor">      {/* 헤더 */}
      <header className="scenario-editor-header">
        <div className="header-left">
          <button 
            className="back-button"
            onClick={() => navigate('/new-scenario')}
          >
            ← 뒤로가기
          </button>
          <h1>{currentScenario.title}</h1>
          <span className="map-name">{selectedMap?.name}</span>
        </div>
        
        <div className="header-right">
          <div className="playback-info">
            <span>시간: {Math.floor(playback.currentTime / 1000)}s / {Math.floor(playback.scenario.timeline.duration / 1000)}s</span>
          </div>
          <button className="save-button" onClick={handleSave}>
            저장
          </button>
        </div>
      </header>{/* 메인 컨텐츠 */}
      <div className="scenario-editor-content">
        {/* 좌측 패널 */}
        <div className="left-panel">
          <PlayerPanel 
            players={currentScenario.players}
            selectedPlayerId={selectedPlayerId}
            onPlayerSelect={handlePlayerSelect}
          />
          
          <ActionPanel 
            actions={currentScenario.actions}
            currentTime={playback.currentTime}
            onActionUpdate={handleActionUpdate}
            onActionDelete={removeAction}
          />
        </div>

        {/* 중앙 맵 영역 */}
        <div className="map-container">
          {selectedMap && (
            <MapCanvas
              map={selectedMap}
              players={currentScenario.players}
              actions={currentScenario.actions}
              currentTime={playback.currentTime}
              selectedPlayerId={selectedPlayerId}
              selectedTool={selectedTool as 'select' | 'move' | 'skill' | 'shoot'}
              onMapClick={handleMapClick}
              onPlayerSelect={handlePlayerSelect}
            />
          )}
          
          <PlaybackControls
            isPlaying={playback.isPlaying}
            currentTime={playback.currentTime}
            duration={playback.scenario.timeline.duration}
            playbackSpeed={playback.playbackSpeed}
            onPlay={play}
            onPause={pause}
            onStop={stop}
            onSeek={seekTo}
          />
        </div>

        {/* 우측 패널 */}
        <div className="right-panel-container">
          <RightPanel
            selectedPlayer={currentScenario.players.find(p => p.id === selectedPlayerId) || null}
            selectedTool={selectedTool}
            onToolChange={handleToolChange}
            onSkillSelect={handleSkillSelect}
            currentTime={playback.currentTime}
            onAddAction={handleAddAction}
          />
        </div>

        {/* 하단 타임라인 */}
        <div className="timeline-container">
          <TimelineEditor
            scenario={currentScenario}
            onTimeChange={seekTo}
            onActionUpdate={handleActionUpdate}
            onActionDelete={removeAction}
          />
        </div>
      </div>
    </div>
  );
};

export default ScenarioEditor;
