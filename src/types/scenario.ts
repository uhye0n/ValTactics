export interface Player {
  id: string;
  name: string;
  agent: string; // Valorant 에이전트 이름
  team: 'attack' | 'defense';
  color: string; // 플레이어 표시 색상
}

export interface Position {
  x: number; // 맵상의 x 좌표
  y: number; // 맵상의 y 좌표
  rotation?: number; // 플레이어가 바라보는 방향 (도)
}

export interface Skill {
  id: string;
  name: string;
  agent: string;
  type: 'basic' | 'signature' | 'ultimate';
  icon: string;
  description?: string;
}

export interface PlayerAction {
  id: string;
  playerId: string;
  timestamp: number; // 타임라인상의 시간 (밀리초)
  type: 'move' | 'skill' | 'shoot' | 'plant' | 'defuse' | 'death' | 'revive';
  position: Position;
  data?: {
    // 스킬 사용시
    skillId?: string;
    targetPosition?: Position;
    // 사격시
    targetPlayerId?: string;
    weapon?: string;
    // 기타
    notes?: string;
  };
}

export interface Timeline {
  duration: number; // 전체 시나리오 길이 (밀리초)
  currentTime: number; // 현재 재생 위치 (밀리초)
  isPlaying: boolean;
  playbackSpeed: number; // 재생 속도 (1.0 = 정상속도)
}

export interface MapData {
  id: string;
  name: string;
  imageUrl: string;
  viewImageUrl: string;
  dimensions: {
    width: number;
    height: number;
  };
  callouts: MapCallout[];
}

export interface MapCallout {
  id: string;
  name: string;
  position: Position;
  area: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  mapId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
  players: Player[];
  actions: PlayerAction[];
  timeline: Timeline;
  metadata: {
    roundType: 'pistol' | 'eco' | 'force-buy' | 'full-buy';
    gameMode: 'competitive' | 'unrated' | 'custom';
    version?: string;
  };
}

export interface ScenarioPlayback {
  scenario: Scenario;
  isPlaying: boolean;
  currentTime: number;
  playbackSpeed: number;
  loop: boolean;
  selectedPlayer?: string;
  visibleLayers: {
    movements: boolean;
    skills: boolean;
    callouts: boolean;
    trajectories: boolean;
  };
}

export interface ScenarioContextType {
  scenarios: Scenario[];
  currentScenario: Scenario | null;
  playback: ScenarioPlayback | null;
  isLoading: boolean;
  
  // 시나리오 관리
  createScenario: (data: Partial<Scenario>) => Promise<Scenario>;
  loadScenario: (id: string) => Promise<void>;
  saveScenario: (scenario: Scenario) => Promise<void>;
  deleteScenario: (id: string) => Promise<void>;
  
  // 플레이어 관리
  addPlayer: (player: Omit<Player, 'id'>) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  
  // 액션 관리
  addAction: (action: Omit<PlayerAction, 'id'>) => void;
  removeAction: (actionId: string) => void;
  updateAction: (actionId: string, updates: Partial<PlayerAction>) => void;
  
  // 타임라인 제어
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekTo: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  
  // 뷰 제어
  setSelectedPlayer: (playerId: string | null) => void;
  toggleLayer: (layer: keyof ScenarioPlayback['visibleLayers']) => void;
}
