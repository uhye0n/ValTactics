// Frontend에서 사용할 API 클라이언트
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data as T;
  }

  // Scenarios
  async getScenarios(params?: {
    page?: number;
    limit?: number;
    public?: boolean;
    userId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.public !== undefined) searchParams.set('public', params.public.toString());
    if (params?.userId) searchParams.set('userId', params.userId);

    const query = searchParams.toString();
    return this.request(`/scenarios${query ? `?${query}` : ''}`);
  }

  async getScenario(id: string) {
    return this.request(`/scenarios/${id}`);
  }

  async createScenario(data: any) {
    return this.request('/scenarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateScenario(id: string, data: any) {
    return this.request(`/scenarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteScenario(id: string) {
    return this.request(`/scenarios/${id}`, {
      method: 'DELETE',
    });
  }

  // Actions
  async getActions(scenarioId: string, playerId?: string) {
    const params = new URLSearchParams({ scenarioId });
    if (playerId) params.set('playerId', playerId);
    
    return this.request(`/actions?${params.toString()}`);
  }

  async createAction(data: any) {
    return this.request('/actions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Maps
  async getMaps() {
    return this.request('/maps');
  }

  async createMap(data: any) {
    return this.request('/maps', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
