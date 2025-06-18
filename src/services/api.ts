// API 서비스 - 백엔드와 통신
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface ApiResponse<T> {
  data?: T
  error?: string
  details?: any
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

class ApiService {
  private token: string | null = null

  constructor() {
    // 로컬 스토리지에서 토큰 복원
    this.token = localStorage.getItem('auth_token')
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('auth_token', token)
  }

  removeToken() {
    this.token = null
    localStorage.removeItem('auth_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'API request failed')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // 인증
  async register(userData: {
    username: string
    email: string
    password: string
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{
      user: any
      token: string
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response.token) {
      this.setToken(response.token)
    }
    
    return response
  }

  // 시나리오
  async getScenarios(params?: {
    page?: number
    limit?: number
    search?: string
    isPublic?: boolean
  }) {
    const queryString = params 
      ? '?' + new URLSearchParams(params as any).toString()
      : ''
    
    return this.request(`/scenarios${queryString}`)
  }

  async getMyScenarios(params?: {
    page?: number
    limit?: number
    search?: string
  }) {
    const queryString = params 
      ? '?' + new URLSearchParams(params as any).toString()
      : ''
    
    return this.request(`/scenarios/my-scenarios${queryString}`)
  }

  async getScenario(id: string) {
    return this.request(`/scenarios/${id}`)
  }

  async createScenario(scenarioData: {
    title: string
    description?: string
    mapId: string
    mapName: string
    isPublic?: boolean
    ourTeam: Array<{
      agentName: string
      agentRole: string
      position: number
    }>
    enemyTeam: Array<{
      agentName: string
      agentRole: string
      position: number
    }>
  }) {
    return this.request('/scenarios', {
      method: 'POST',
      body: JSON.stringify(scenarioData),
    })
  }

  async updateScenario(id: string, updates: {
    title?: string
    description?: string
    isPublic?: boolean
  }) {
    return this.request(`/scenarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteScenario(id: string) {
    return this.request(`/scenarios/${id}`, {
      method: 'DELETE',
    })
  }

  async updateTimeline(scenarioId: string, timelineData: {
    duration: number
    rounds: number
    events: Array<{
      timestamp: number
      eventType: string
      description?: string
      data: any
    }>
  }) {
    return this.request(`/scenarios/${scenarioId}/timeline`, {
      method: 'PUT',
      body: JSON.stringify(timelineData),
    })  }

  // 플레이어 액션 기록
  async recordPlayerAction(scenarioId: string, actionData: {
    playerId: string;
    actionType: string;
    timestamp: number;
    position?: { x: number; y: number };
    data?: any;
  }) {
    return this.request(`/scenarios/${scenarioId}/actions`, {
      method: 'POST',
      body: JSON.stringify(actionData),
    })
  }

  // 타임라인 이벤트 추가
  addTimelineEvent = async (scenarioId: string, eventData: {
    id: string;
    playerId: string;
    actionType: string;
    timestamp: number;
    position: { x: number; y: number };
    metadata?: any;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scenarios/${scenarioId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || 'Failed to add timeline event');
      }

      return response.json();
    } catch (error) {
      console.error('API Error in addTimelineEvent:', error);
      throw error;
    }
  };

  // 타임라인 이벤트 업데이트
  updateTimelineEvent = async (scenarioId: string, eventId: string, updates: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scenarios/${scenarioId}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || 'Failed to update timeline event');
      }

      return response.json();
    } catch (error) {
      console.error('API Error in updateTimelineEvent:', error);
      throw error;
    }
  };

  // 타임라인 이벤트 삭제
  deleteTimelineEvent = async (scenarioId: string, eventId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scenarios/${scenarioId}/events/${eventId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || 'Failed to delete timeline event');
      }

      return response.ok;
    } catch (error) {
      console.error('API Error in deleteTimelineEvent:', error);
      throw error;
    }
  };

  async updateMapObjects(scenarioId: string, objects: Array<{
    objectType: string
    objectName?: string
    positionX: number
    positionY: number
    width?: number
    height?: number
    radius?: number
    color?: string
    opacity?: number
    startTime?: number
    endTime?: number
    duration?: number
    data?: any
  }>) {
    return this.request(`/scenarios/${scenarioId}/map-objects`, {
      method: 'PUT',
      body: JSON.stringify({ objects }),
    })
  }

  // 맵
  async getMaps() {
    return this.request('/maps')
  }

  async getMap(id: string) {
    return this.request(`/maps/${id}`)
  }

  // 사용자
  async getUserProfile() {
    return this.request('/users/profile')
  }

  async updateUserProfile(updates: {
    username?: string
    avatar?: string
    rank?: string
    level?: number
  }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }
}

export const apiService = new ApiService()
export default apiService
