import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Scenario, 
  ScenarioContextType, 
  ScenarioPlayback, 
  Player, 
  PlayerAction 
} from '../types/scenario';

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

  // 타임라인 업데이트 타이머
  useEffect(() => {
    if (!playback?.isPlaying) return;

    const interval = setInterval(() => {
      setPlayback(prev => {
        if (!prev || !prev.isPlaying) return prev;
        
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

  const createScenario = useCallback(async (data: Partial<Scenario>): Promise<Scenario> => {
    setIsLoading(true);
    try {
      const newScenario: Scenario = {
        id: `scenario-${Date.now()}`,
        title: data.title || '새 시나리오',
        description: data.description || '',
        mapId: data.mapId || 'ascent',
        createdBy: 'current-user', // TODO: 실제 사용자 ID
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: data.isPublic || false,
        tags: data.tags || [],
        players: data.players || [],
        actions: data.actions || [],
        timeline: {
          duration: data.timeline?.duration || 120000, // 2분 기본값
          currentTime: 0,
          isPlaying: false,
          playbackSpeed: 1.0
        },
        metadata: {
          roundType: 'full-buy',
          gameMode: 'competitive',
          ...data.metadata
        }
      };

      setScenarios(prev => [...prev, newScenario]);
      return newScenario;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadScenario = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      const scenario = scenarios.find(s => s.id === id);
      if (scenario) {
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
      }
    } finally {
      setIsLoading(false);
    }
  }, [scenarios]);

  const saveScenario = useCallback(async (scenario: Scenario): Promise<void> => {
    setIsLoading(true);
    try {
      const updatedScenario = { ...scenario, updatedAt: new Date() };
      setScenarios(prev => prev.map(s => s.id === scenario.id ? updatedScenario : s));
      if (currentScenario?.id === scenario.id) {
        setCurrentScenario(updatedScenario);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentScenario]);

  const deleteScenario = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      setScenarios(prev => prev.filter(s => s.id !== id));
      if (currentScenario?.id === id) {
        setCurrentScenario(null);
        setPlayback(null);
      }
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
      players: [...currentScenario.players, newPlayer]
    };
    
    setCurrentScenario(updatedScenario);
    setPlayback(prev => prev ? { ...prev, scenario: updatedScenario } : null);
  }, [currentScenario]);

  const removePlayer = useCallback((playerId: string) => {
    if (!currentScenario) return;
    
    const updatedScenario = {
      ...currentScenario,
      players: currentScenario.players.filter(p => p.id !== playerId),
      actions: currentScenario.actions.filter(a => a.playerId !== playerId)
    };
    
    setCurrentScenario(updatedScenario);
    setPlayback(prev => prev ? { ...prev, scenario: updatedScenario } : null);
  }, [currentScenario]);

  const updatePlayer = useCallback((playerId: string, updates: Partial<Player>) => {
    if (!currentScenario) return;
    
    const updatedScenario = {
      ...currentScenario,
      players: currentScenario.players.map(p => 
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
      actions: [...currentScenario.actions, newAction].sort((a, b) => a.timestamp - b.timestamp)
    };
    
    setCurrentScenario(updatedScenario);
    setPlayback(prev => prev ? { ...prev, scenario: updatedScenario } : null);
  }, [currentScenario]);

  const removeAction = useCallback((actionId: string) => {
    if (!currentScenario) return;
    
    const updatedScenario = {
      ...currentScenario,
      actions: currentScenario.actions.filter(a => a.id !== actionId)
    };
    
    setCurrentScenario(updatedScenario);
    setPlayback(prev => prev ? { ...prev, scenario: updatedScenario } : null);
  }, [currentScenario]);

  const updateAction = useCallback((actionId: string, updates: Partial<PlayerAction>) => {
    if (!currentScenario) return;
    
    const updatedScenario = {
      ...currentScenario,
      actions: currentScenario.actions.map(a => 
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
      if (!prev) return null;
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
