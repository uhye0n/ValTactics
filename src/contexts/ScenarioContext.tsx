import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  Scenario, 
  ScenarioContextType, 
  ScenarioPlayback, 
  Player, 
  PlayerAction,
  CreateScenarioData
} from '../types/scenario';
import apiService from '../services/api';
import socketService from '../services/socket';

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export const useScenario = () => {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return context;
};

interface ScenarioProviderProps {
  children: React.ReactNode;
}

export const ScenarioProvider: React.FC<ScenarioProviderProps> = ({ children }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [playback, setPlayback] = useState<ScenarioPlayback | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Socket 연결 및 실시간 이벤트 처리
  useEffect(() => {
    socketService.connect();

    // 시나리오 업데이트 수신
    const handleScenarioUpdated = (data: any) => {
      if (currentScenario && data.scenarioId === currentScenario.id) {
        setCurrentScenario(prev => prev ? { ...prev, ...data } : null);
      }
    };

    // 타임라인 동기화 수신
    const handleTimelineSynced = (data: any) => {
      if (currentScenario && data.scenarioId === currentScenario.id) {
        setPlayback(prev => prev ? { ...prev, currentTime: data.currentTime } : null);
      }
    };

    socketService.onScenarioUpdated(handleScenarioUpdated);
    socketService.onTimelineSynced(handleTimelineSynced);

    return () => {
      socketService.offScenarioUpdated(handleScenarioUpdated);
      socketService.offTimelineSynced(handleTimelineSynced);
      socketService.disconnect();
    };
  }, [currentScenario]);

  // 컴포넌트 마운트 시 시나리오 목록 로드
  useEffect(() => {
    const loadScenarios = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getScenarios() as { scenarios: Scenario[] };
        setScenarios(response.scenarios || []);
      } catch (error) {
        console.error('Failed to load scenarios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadScenarios();
  }, []);

  // 타임라인 업데이트 타이머
  useEffect(() => {
    if (!playback?.isPlaying) return;

    const interval = setInterval(() => {
      setPlayback(prev => {
        if (!prev || !prev.isPlaying || !prev.scenario.timeline) return prev;
        
        const newTime = prev.currentTime + (16 * prev.playbackSpeed); // 16ms = ~60fps
        const maxTime = prev.scenario.timeline.duration;
        
        if (newTime >= maxTime) {
          if (prev.loop) {
            return { ...prev, currentTime: 0 };
          } else {
            return { ...prev, currentTime: maxTime, isPlaying: false };
          }
        }
        
        return { ...prev, currentTime: newTime };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [playback?.isPlaying, playback?.playbackSpeed, playback?.loop]);
  const createScenario = useCallback(async (data: CreateScenarioData): Promise<Scenario> => {
    setIsLoading(true);
    try {
      // 백엔드 API 호출
      const response = await apiService.createScenario(data);
      const newScenario = response as Scenario;
      
      setScenarios(prev => [...prev, newScenario]);
      return newScenario;
    } catch (error: any) {
      throw new Error(error.message || '시나리오 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);  const loadScenario = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // 백엔드에서 시나리오 데이터 가져오기
      const scenario = await apiService.getScenario(id) as Scenario;
      setCurrentScenario(scenario);
      setPlayback({
        scenario,
        isPlaying: false,
        currentTime: 0,
        playbackSpeed: 1.0,
        loop: false,
        visibleLayers: {
          movements: true,
          skills: true,
          callouts: true,
          trajectories: true
        }
      });

      // Socket으로 시나리오 방 참가
      socketService.joinScenario(id);
    } catch (error: any) {
      console.error('Failed to load scenario:', error);
      throw new Error(error.message || '시나리오 로드에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveScenario = useCallback(async (scenario: Scenario): Promise<void> => {
    setIsLoading(true);
    try {
      // 백엔드에 시나리오 업데이트 요청
      const updates = {
        title: scenario.title,
        description: scenario.description,
        isPublic: scenario.isPublic
      };
      
      await apiService.updateScenario(scenario.id, updates);
      
      // 타임라인 업데이트
      if (scenario.timeline) {
        await apiService.updateTimeline(scenario.id, {
          duration: scenario.timeline.duration,
          rounds: scenario.timeline.rounds,
          events: scenario.timeline.events || []
        });
      }
        // 맵 오브젝트 업데이트
      if (scenario.mapObjects) {
        await apiService.updateMapObjects(scenario.id, scenario.mapObjects);
      }
      
      const updatedScenario = { ...scenario, updatedAt: new Date() };
      setScenarios(prev => prev.map(s => s.id === scenario.id ? updatedScenario : s));
      if (currentScenario?.id === scenario.id) {
        setCurrentScenario(updatedScenario);
      }

      // Socket으로 실시간 업데이트 전송
      socketService.updateScenario(scenario.id, updatedScenario);
    } catch (error: any) {
      console.error('Failed to save scenario:', error);
      throw new Error(error.message || '시나리오 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentScenario]);

  const deleteScenario = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // 백엔드에서 시나리오 삭제
      await apiService.deleteScenario(id);
      
      setScenarios(prev => prev.filter(s => s.id !== id));
      if (currentScenario?.id === id) {
        setCurrentScenario(null);
        setPlayback(null);
      }
    } catch (error: any) {
      console.error('Failed to delete scenario:', error);
      throw new Error(error.message || '시나리오 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentScenario]);
  const addPlayer = useCallback((player: Omit<Player, 'id'>) => {
    if (!currentScenario) return;
    
    const newPlayer: Player = {
      ...player,
      id: `player-${Date.now()}`
    };
    
    const updatedScenario = {
      ...currentScenario,
      players: [...(currentScenario.players || []), newPlayer]
    };
    
    setCurrentScenario(updatedScenario);
    setPlayback(prev => prev ? { ...prev, scenario: updatedScenario } : null);
  }, [currentScenario]);

  const removePlayer = useCallback((playerId: string) => {
    if (!currentScenario) return;
    
    const updatedScenario = {
      ...currentScenario,
      players: (currentScenario.players || []).filter(p => p.id !== playerId),
      actions: (currentScenario.actions || []).filter(a => a.teamCompositionId !== playerId)
    };
    
    setCurrentScenario(updatedScenario);
    setPlayback(prev => prev ? { ...prev, scenario: updatedScenario } : null);
  }, [currentScenario]);

  const updatePlayer = useCallback((playerId: string, updates: Partial<Player>) => {
    if (!currentScenario) return;
    
    const updatedScenario = {
      ...currentScenario,
      players: (currentScenario.players || []).map(p => 
        p.id === playerId ? { ...p, ...updates } : p
      )
    };
    
    setCurrentScenario(updatedScenario);
    setPlayback(prev => prev ? { ...prev, scenario: updatedScenario } : null);
  }, [currentScenario]);
  const addAction = useCallback((action: Omit<PlayerAction, 'id'>) => {
    if (!currentScenario) return;
    
    const newAction: PlayerAction = {
      ...action,
      id: `action-${Date.now()}`
    };
    
    const updatedScenario = {
      ...currentScenario,
      actions: [...(currentScenario.actions || []), newAction].sort((a, b) => a.timestamp - b.timestamp)
    };
    
    setCurrentScenario(updatedScenario);
    setPlayback(prev => prev ? { ...prev, scenario: updatedScenario } : null);
  }, [currentScenario]);

  const removeAction = useCallback((actionId: string) => {
    if (!currentScenario) return;
    
    const updatedScenario = {
      ...currentScenario,
      actions: (currentScenario.actions || []).filter(a => a.id !== actionId)
    };
    
    setCurrentScenario(updatedScenario);
    setPlayback(prev => prev ? { ...prev, scenario: updatedScenario } : null);
  }, [currentScenario]);

  const updateAction = useCallback((actionId: string, updates: Partial<PlayerAction>) => {
    if (!currentScenario) return;
    
    const updatedScenario = {
      ...currentScenario,
      actions: (currentScenario.actions || []).map(a => 
        a.id === actionId ? { ...a, ...updates } : a
      ).sort((a, b) => a.timestamp - b.timestamp)
    };
    
    setCurrentScenario(updatedScenario);
    setPlayback(prev => prev ? { ...prev, scenario: updatedScenario } : null);
  }, [currentScenario]);

  const play = useCallback(() => {
    setPlayback(prev => prev ? { ...prev, isPlaying: true } : null);
  }, []);

  const pause = useCallback(() => {
    setPlayback(prev => prev ? { ...prev, isPlaying: false } : null);
  }, []);

  const stop = useCallback(() => {
    setPlayback(prev => prev ? { ...prev, isPlaying: false, currentTime: 0 } : null);
  }, []);
  const seekTo = useCallback((time: number) => {
    setPlayback(prev => {
      if (!prev || !prev.scenario.timeline) return null;
      const clampedTime = Math.max(0, Math.min(time, prev.scenario.timeline.duration));
      return { ...prev, currentTime: clampedTime };
    });
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    setPlayback(prev => prev ? { ...prev, playbackSpeed: speed } : null);
  }, []);

  const setSelectedPlayer = useCallback((playerId: string | null) => {
    setPlayback(prev => prev ? { ...prev, selectedPlayer: playerId || undefined } : null);
  }, []);

  const toggleLayer = useCallback((layer: keyof ScenarioPlayback['visibleLayers']) => {
    setPlayback(prev => {
      if (!prev) return null;
      return {
        ...prev,
        visibleLayers: {
          ...prev.visibleLayers,
          [layer]: !prev.visibleLayers[layer]
        }
      };
    });
  }, []);

  const value: ScenarioContextType = {
    scenarios,
    currentScenario,
    playback,
    isLoading,
    createScenario,
    loadScenario,
    saveScenario,
    deleteScenario,
    addPlayer,
    removePlayer,
    updatePlayer,
    addAction,
    removeAction,
    updateAction,
    play,
    pause,
    stop,
    seekTo,
    setPlaybackSpeed,
    setSelectedPlayer,
    toggleLayer
  };

  return (
    <ScenarioContext.Provider value={value}>
      {children}
    </ScenarioContext.Provider>
  );
};
