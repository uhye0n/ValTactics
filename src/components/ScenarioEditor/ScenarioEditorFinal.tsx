import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScenario } from '../../contexts/ScenarioContext';
import type { Player, Position } from '../../types/scenario';
import MapCanvas from './MapCanvas';
import TimelineEditor from './TimelineEditor';
import PlayerPanel from './PlayerPanel';
import ActionSelectionPanel from './ActionSelectionPanel';
import PlaybackControls from './PlaybackControls';
import apiService from '../../services/api';
import './ScenarioEditorComplete.css';

const ScenarioEditor: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const { currentScenario, loadScenario, isLoading } = useScenario();  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [rightPanelMode, setRightPanelMode] = useState<'players' | 'actions'>('players');
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // 맵 팬 기능을 위한 상태
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mapScale, setMapScale] = useState(1.2); // 초기 스케일을 1에서 1.2로 증가
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // 플레이어 위치 상태 관리
  const [playerPositions, setPlayerPositions] = useState<{ [playerId: string]: { x: number, y: number } }>({});
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // 시나리오 로드
  useEffect(() => {
    if (!scenarioId) {
      setLoadError('시나리오 ID가 필요합니다.');
      return;
    }

    const loadScenarioData = async () => {
      try {
        setLoadError(null);
        await loadScenario(scenarioId);
      } catch (error: any) {
        console.error('Failed to load scenario:', error);
        setLoadError(error.message || '시나리오를 불러오는데 실패했습니다.');
      }
    };

    loadScenarioData();
  }, [scenarioId, loadScenario]);

  // 키보드 이벤트 핸들러 (스킬 사용 등)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedPlayerId) return;
      
      const currentPos = getPlayerPosition(players.find(p => p.id === selectedPlayerId));
      
      switch (e.key.toLowerCase()) {
        case 'q':
          recordPlayerAction(selectedPlayerId, 'skill', currentPos, { skillType: 'Q', skillName: 'Ability Q' });
          break;
        case 'e':
          recordPlayerAction(selectedPlayerId, 'skill', currentPos, { skillType: 'E', skillName: 'Ability E' });
          break;
        case 'c':
          recordPlayerAction(selectedPlayerId, 'skill', currentPos, { skillType: 'C', skillName: 'Ability C' });
          break;
        case 'x':
          recordPlayerAction(selectedPlayerId, 'skill', currentPos, { skillType: 'X', skillName: 'Ultimate' });
          break;
        case ' ':
          e.preventDefault();
          recordPlayerAction(selectedPlayerId, 'shoot', currentPos, { weaponType: 'primary' });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPlayerId, playerPositions]);
  // 로딩 또는 에러 상태 표시
  if (isLoading) {
    return (
      <div className="scenario-editor-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>시나리오를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="scenario-editor-error">
        <div className="error-content">
          <h2>시나리오 로드 실패</h2>
          <p>{loadError}</p>
          <button onClick={() => navigate('/')}>메인으로 돌아가기</button>
        </div>
      </div>
    );
  }

  if (!currentScenario) {
    return (
      <div className="scenario-editor-error">
        <div className="error-content">
          <h2>시나리오를 찾을 수 없습니다</h2>
          <p>요청한 시나리오가 존재하지 않습니다.</p>
          <button onClick={() => navigate('/')}>메인으로 돌아가기</button>
        </div>
      </div>
    );
  }
  // 맵 이미지 경로 설정
  const getMapImagePath = (mapId: string) => {
    const mapImageMap: { [key: string]: string } = {
      'abyss': '/resources/images/map/Abyss_map.webp',
      'ascent': '/resources/images/map/Ascent_map.webp',
      'bind': '/resources/images/map/Bind_map.webp',
      'breeze': '/resources/images/map/Breeze_map.webp',
      'fracture': '/resources/images/map/Fracture_map.webp',
      'haven': '/resources/images/map/Haven_map.webp',
      'icebox': '/resources/images/map/Icebox_map.webp',
      'lotus': '/resources/images/map/Lotus_map.webp',
      'pearl': '/resources/images/map/Pearl_map.webp',
      'split': '/resources/images/map/Split_map.webp',
      'sunset': '/resources/images/map/Sunset_map.webp'
    };
    return mapImageMap[mapId.toLowerCase()] || '/resources/images/map/Ascent_map.webp';
  };

  const handlePlayerSelect = (playerId: string | null) => {
    setSelectedPlayerId(playerId);
    if (playerId) {
      setRightPanelMode('actions'); // 플레이어 선택 후 액션 패널로 전환
    }
  };  const handleActionSelect = (actionType: string) => {
    setSelectedAction(actionType);
  };

  // 플레이어 액션 기록 함수
  const recordPlayerAction = async (playerId: string, actionType: 'move' | 'skill' | 'shoot' | 'plant' | 'defuse' | 'death' | 'revive', position: { x: number; y: number }, data?: any) => {
    if (!currentScenario?.id) return;
    
    try {
      await apiService.recordPlayerAction(currentScenario.id, {
        playerId,
        actionType,
        timestamp: Date.now(),
        position,
        data
      });
      console.log(`Recorded ${actionType} action for player ${playerId}`);
    } catch (error) {
      console.error('Failed to record player action:', error);
    }
  };// 맵 드래그 이벤트 핸들러들
  const handleMouseDown = (e: React.MouseEvent) => {
    // 플레이어를 드래그하는 중이면 맵 드래그 방지
    if (draggedPlayer) return;
    
    if (e.button === 1) { // 마우스 가운데 버튼 (휠 클릭)
      e.preventDefault();
      setIsDragging(true);
      
      // 현재 마우스 위치와 맵 오프셋의 차이를 계산
      const startX = e.clientX - mapOffset.x;
      const startY = e.clientY - mapOffset.y;
        const handleMouseMove = (moveEvent: MouseEvent) => {
        if (mapContainerRef.current) {
          const containerRect = mapContainerRef.current.getBoundingClientRect();
          
          // 맵 이미지의 실제 크기 계산 (200% * 스케일)
          const imageScale = 2.0 * mapScale; // 200% CSS + 동적 스케일
          const scaledImageWidth = containerRect.width * imageScale;
          const scaledImageHeight = containerRect.height * imageScale;
          
          // 컨테이너를 벗어나지 않도록 최대 오프셋 계산
          const maxOffsetX = Math.max(0, (scaledImageWidth - containerRect.width) / 2);
          const maxOffsetY = Math.max(0, (scaledImageHeight - containerRect.height) / 2);
          
          let newX = moveEvent.clientX - startX;
          let newY = moveEvent.clientY - startY;
          
          // 드래그 범위 제한 - 이미지 크기에 비례하여 자연스럽게 제한
          newX = Math.max(-maxOffsetX, Math.min(maxOffsetX, newX));
          newY = Math.max(-maxOffsetY, Math.min(maxOffsetY, newY));
          
          setMapOffset({ x: newX, y: newY });
        }
      };
        const handleMouseUp = () => {
        setIsDragging(false);
        document.body.classList.remove('map-active'); // body 드래그 방지 해제
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.body.classList.add('map-active'); // body 드래그 방지 활성화
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(mapScale * scaleChange, 0.5), 3);
    setMapScale(newScale);
    
    // 스케일 변경 시 오프셋 범위 재조정
    if (mapContainerRef.current) {
      const containerRect = mapContainerRef.current.getBoundingClientRect();
      const imageScale = 2.0 * newScale;
      const scaledImageWidth = containerRect.width * imageScale;
      const scaledImageHeight = containerRect.height * imageScale;
      
      const maxOffsetX = Math.max(0, (scaledImageWidth - containerRect.width) / 2);
      const maxOffsetY = Math.max(0, (scaledImageHeight - containerRect.height) / 2);
      
      // 현재 오프셋이 새로운 범위를 벗어나면 조정
      setMapOffset(prev => ({
        x: Math.min(Math.max(prev.x, -maxOffsetX), maxOffsetX),
        y: Math.min(Math.max(prev.y, -maxOffsetY), maxOffsetY)
      }));
    }
  };  const handleMapClick = (position: Position) => {
    if (selectedPlayerId && selectedAction && currentScenario) {
      // 액션 추가 로직은 나중에 구현
      console.log('Action added:', { playerId: selectedPlayerId, action: selectedAction, position });
      
      // 액션 추가 후 다시 플레이어 선택 모드로
      setSelectedAction(null);
      setRightPanelMode('players');
    }
  };
  
  // teams 데이터를 Player 배열로 변환하는 함수
  const convertTeamsToPlayers = (teams: any[] = []): Player[] => {
    return teams.map((team) => ({
      id: team.id,
      name: `${team.agentName} ${team.position + 1}`, // "Jett 1", "Sage 2" 형태
      agent: team.agentName,
      team: team.teamType as 'our' | 'enemy',
      role: team.agentRole,
      position: team.position,
      color: team.teamType === 'our' ? '#4CAF50' : '#F44336' // 아군은 초록, 적군은 빨강
    }));
  };

  // 현재 시나리오의 플레이어 목록 계산
  const players = currentScenario ? convertTeamsToPlayers(currentScenario.teams) : [];
  const selectedPlayer = selectedPlayerId    ? players.find(p => p.id === selectedPlayerId) || null
    : null;

  // 간단한 플레이어 드래그 핸들러 (더 정확한 방식)
  const handlePlayerMouseDownSimple = (e: React.MouseEvent, playerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.button !== 0) return; // 좌클릭만 허용
    
    setDraggedPlayer(playerId);
    handlePlayerSelect(playerId);
    
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return;
    
    const mapOverlay = mapContainer.querySelector('.map-overlay') as HTMLElement;
    if (!mapOverlay) return;    const handleMouseMove = (moveEvent: MouseEvent) => {
      const overlayRect = mapOverlay.getBoundingClientRect();
      
      // 마우스 위치를 맵 오버레이 기준 백분율로 변환
      const mouseX = moveEvent.clientX - overlayRect.left;
      const mouseY = moveEvent.clientY - overlayRect.top;
      
      const percentX = (mouseX / overlayRect.width) * 100;
      const percentY = (mouseY / overlayRect.height) * 100;
      
      // 이미지 전체 영역을 사용할 수 있도록 범위 설정
      const clampedX = Math.max(0, Math.min(100, percentX));
      const clampedY = Math.max(0, Math.min(100, percentY));
      
      setPlayerPositions(prev => ({
        ...prev,
        [playerId]: { x: clampedX, y: clampedY }
      }));
    };
      const handleMouseUp = () => {
      // 드래그가 끝났을 때 최종 위치를 기록
      if (draggedPlayer && playerPositions[draggedPlayer]) {
        const finalPosition = playerPositions[draggedPlayer];
        recordPlayerAction(draggedPlayer, 'move', finalPosition);
      }
      
      setDraggedPlayer(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 플레이어 위치 계산 함수
  const getPlayerPosition = (player: any) => {
    // 사용자가 이동시킨 위치가 있으면 그것을 사용
    if (playerPositions[player.id]) {
      return playerPositions[player.id];
    }
    
    // 기본 위치 계산
    const isOurTeam = player.team === 'our';
    const teamIndex = isOurTeam 
      ? players.filter(p => p.team === 'our').indexOf(player)
      : players.filter(p => p.team === 'enemy').indexOf(player);
      const baseX = isOurTeam ? 15 : 75;
    const baseY = 10 + (teamIndex * 10);
    
    return { x: baseX, y: baseY };
  };
  // 플레이어 위치 리셋 함수
  const resetPlayerPosition = (playerId: string) => {
    setPlayerPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[playerId];
      return newPositions;
    });
  };

  // 로딩 상태는 제거 (더미 데이터가 있으므로 항상 시나리오가 존재)
    return (
    <div className="scenario-editor">
      <div className="scenario-editor-background"></div>
      
      {/* Header는 App.tsx에서 렌더링되므로 여기서는 제거 */}
        <div className="scenario-editor-content">
        {/* 메인 콘텐츠 영역 */}
        <div className="editor-main-container">
          {/* 왼쪽: 맵 영역 */}
          <div className="editor-map-section">
            <div className="map-container" ref={mapContainerRef}>              <div 
                className={`map-canvas ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleMouseDown}
                onWheel={handleWheel}
                onContextMenu={(e) => e.preventDefault()} // 우클릭 메뉴 방지
                style={{
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none'
                }}
              >
                <div 
                  className="map-content"
                  style={{
                    transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${mapScale})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                  }}
                >                  <img 
                    src={getMapImagePath(currentScenario.mapId)} 
                    alt={`${currentScenario.title} Map`}
                    className="map-image"
                    draggable={false}
                  />
                  <div 
                    className="map-overlay" 
                    onClick={(e) => {
                      if (selectedPlayerId && selectedAction) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        handleMapClick({ x, y });
                      }
                    }}
                  >                    {/* 플레이어 마커들이 여기에 렌더링됩니다 */}                    {players.map((player) => {
                      const position = getPlayerPosition(player);
                      const teamIndex = player.team === 'our' 
                        ? players.filter(p => p.team === 'our').indexOf(player)
                        : players.filter(p => p.team === 'enemy').indexOf(player);
                      
                      const isDragging = draggedPlayer === player.id;
                      
                      return (
                        <div
                          key={player.id}
                          className={`player-marker ${selectedPlayerId === player.id ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
                          style={{
                            backgroundColor: player.color,
                            position: 'absolute',
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '10px',
                            border: player.team === 'our' ? '3px solid #4CAF50' : '3px solid #F44336',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            zIndex: isDragging ? 20 : 10,
                            boxShadow: isDragging 
                              ? '0 8px 16px rgba(0,0,0,0.8)' 
                              : '0 2px 8px rgba(0,0,0,0.5)',
                            transition: isDragging ? 'none' : 'all 0.2s ease',
                            opacity: isDragging ? 0.9 : 1,
                            userSelect: 'none'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isDragging) {
                              handlePlayerSelect(player.id);
                            }
                          }}                          onMouseDown={(e) => handlePlayerMouseDownSimple(e, player.id)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            resetPlayerPosition(player.id);
                          }}
                          title={`${player.name} (${player.agent} - ${player.role}) - 우클릭으로 위치 리셋`}
                        >
                          <div style={{ fontSize: '12px', lineHeight: '1' }}>
                            {player.agent.substring(0, 3).toUpperCase()}
                          </div>
                          <div style={{ fontSize: '8px', lineHeight: '1', opacity: 0.8 }}>
                            {teamIndex + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
              {/* 하단 타임라인 */}
            <div className="timeline-section">              <TimelineEditor
                scenario={currentScenario}
                onTimeChange={(time: number) => {
                  console.log('Timeline time changed to:', time);
                  // 필요시 시나리오의 현재 시간 업데이트
                }}
                onActionUpdate={async (actionId, updates) => {
                  try {
                    await apiService.updateTimelineEvent(currentScenario.id, actionId, updates);
                    console.log('Timeline event updated successfully');
                    // 시나리오 다시 로드하여 UI 업데이트
                    await loadScenario(currentScenario.id);
                  } catch (error) {
                    console.error('Failed to update timeline event:', error);
                  }
                }}
                onActionDelete={async (actionId) => {
                  try {
                    await apiService.deleteTimelineEvent(currentScenario.id, actionId);
                    console.log('Timeline event deleted successfully');
                    // 시나리오 다시 로드하여 UI 업데이트
                    await loadScenario(currentScenario.id);
                  } catch (error) {
                    console.error('Failed to delete timeline event:', error);
                  }
                }}
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

            <div className="panel-content">              {rightPanelMode === 'players' ? (
                <PlayerPanel
                  players={players}
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
