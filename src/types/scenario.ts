// Scenario types for ValTactics - Backend Compatible
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  rank?: string;
  level?: number;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface Player {
  id: string;
  name: string;
  agent: string; // Valorant 에이전트 이름
  team: 'our' | 'enemy'; // 백엔드와 호환
  color?: string; // 플레이어 표시 색상
  role: string; // 요원 역할 (Duelist, Controller, Initiator, Sentinel)
  position: number; // 팀 내 순서
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
  teamCompositionId: string; // 백엔드와 호환
  timestamp: number; // 타임라인상의 시간 (밀리초)
  actionType: string; // 백엔드와 호환 ('move', 'skill', 'shoot', 'plant', 'defuse', 'death')
  positionX?: number;
  positionY?: number;
  targetX?: number;
  targetY?: number;
  skillId?: string;
  skillName?: string;
  data?: string; // JSON 문자열로 저장
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  eventType: string;
  description?: string;
  data: any; // JSON 데이터
}

export interface Timeline {
  id: string;
  scenarioId: string;
  duration: number; // 전체 시나리오 길이 (밀리초)
  rounds: number;
  events: TimelineEvent[];
}

export interface MapObject {
  id: string;
  scenarioId: string;
  objectType: string; // "spike", "wall", "smoke", "flash", "molly" 등
  objectName?: string;
  positionX: number;
  positionY: number;
  width?: number;
  height?: number;
  radius?: number; // 원형 オブジェクト용
  color?: string;
  opacity?: number;
  startTime?: number; // 나타나는 시간
  endTime?: number; // 사라지는 시간
  duration?: number; // 지속 시간
  data?: string; // JSON 형태
}

export interface MapData {
  id: string;
  name: string;
  displayName: string;
  imageUrl: string;
  viewImageUrl?: string;
  width: number;
  height: number;
  sites: string[]; // JSON에서 파싱된 배열
  callouts: string[]; // JSON에서 파싱된 배열
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

export interface TeamComposition {
  id: string;
  scenarioId: string;
  teamType: 'our' | 'enemy';
  agentName: string;
  agentRole: string;
  position: number;
  playerActions: PlayerAction[];
}

export interface ScenarioShare {
  id: string;
  scenarioId: string;
  userId: string;
  user: User;
  permission: 'view' | 'edit';
  createdAt: Date;
}

export interface Scenario {
  id: string;
  title: string;
  description?: string;
  mapId: string;
  mapName: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // 작성자
  authorId: string;
  author: User;
  
  // 팀 구성 (백엔드 호환)
  teams?: TeamComposition[]; // 모든 팀
  ourTeam?: TeamComposition[]; // 우리 팀만 (필터링용)
  enemyTeam?: TeamComposition[]; // 적팀만 (필터링용)
  
  // 타임라인
  timeline?: Timeline;
  
  // 맵 오브젝트
  mapObjects?: MapObject[];
  
  // 공유 설정
  shares?: ScenarioShare[];
  
  // 호환성을 위한 기존 필드들
  players?: Player[];
  actions?: PlayerAction[];
  tags?: string[];
  metadata?: {
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
  createScenario: (data: CreateScenarioData) => Promise<Scenario>;
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

// API 요청용 타입들
export interface CreateScenarioData {
  title: string;
  description?: string;
  mapId: string;
  mapName: string;
  isPublic?: boolean;
  ourTeam: {
    agentName: string;
    agentRole: string;
    position: number;
  }[];
  enemyTeam: {
    agentName: string;
    agentRole: string;
    position: number;
  }[];
}
