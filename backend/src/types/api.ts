// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Scenario Types (Frontend와 호환)
export interface CreateScenarioRequest {
  title: string;
  description?: string;
  mapId: string;
  isPublic?: boolean;
  tags?: string[];
  roundType?: 'PISTOL' | 'ECO' | 'FORCE_BUY' | 'FULL_BUY';
  gameMode?: 'COMPETITIVE' | 'UNRATED' | 'CUSTOM';
  players: {
    name: string;
    agent: string;
    team: 'ATTACK' | 'DEFENSE';
    color: string;
  }[];
}

export interface UpdateScenarioRequest extends Partial<CreateScenarioRequest> {
  duration?: number;
  currentTime?: number;
  playbackSpeed?: number;
}

// Player Action Types
export interface CreateActionRequest {
  scenarioId: string;
  playerId: string;
  timestamp: number;
  type: 'MOVE' | 'SKILL' | 'SHOOT' | 'PLANT' | 'DEFUSE' | 'DEATH' | 'REVIVE';
  positionX: number;
  positionY: number;
  rotation?: number;
  data?: any;
}

// User Types
export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Map Types
export interface CreateMapRequest {
  name: string;
  imageUrl: string;
  viewImageUrl: string;
  width: number;
  height: number;
  callouts?: {
    name: string;
    positionX: number;
    positionY: number;
    areaX: number;
    areaY: number;
    areaWidth: number;
    areaHeight: number;
  }[];
}
