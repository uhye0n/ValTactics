import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(token?: string) {
    if (this.isConnected && this.socket) {
      return this.socket;
    }

    const serverUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';
    
    this.socket = io(serverUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });    this.socket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // 시나리오 관련 실시간 기능
  joinScenario(scenarioId: string) {
    if (this.socket) {
      this.socket.emit('join-scenario', scenarioId);
    }
  }

  leaveScenario(scenarioId: string) {
    if (this.socket) {
      this.socket.emit('leave-scenario', scenarioId);
    }
  }

  updateScenario(scenarioId: string, data: any) {
    if (this.socket) {
      this.socket.emit('scenario-update', { scenarioId, ...data });
    }
  }

  syncTimeline(scenarioId: string, timelineData: any) {
    if (this.socket) {
      this.socket.emit('timeline-sync', { scenarioId, ...timelineData });
    }
  }

  // 이벤트 리스너
  onScenarioUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('scenario-updated', callback);
    }
  }

  onTimelineSynced(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('timeline-synced', callback);
    }
  }

  // 리스너 제거
  offScenarioUpdated(callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off('scenario-updated', callback);
    }
  }

  offTimelineSynced(callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off('timeline-synced', callback);
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

export const socketService = new SocketService();
export default socketService;
