import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { MapData, Position, Player, PlayerAction } from '../../types/scenario';
import './MapCanvas.css';

interface MapCanvasProps {
  map: MapData | undefined;
  players: Player[];
  actions: PlayerAction[];
  currentTime: number;
  selectedPlayerId: string | null;
  selectedTool: 'select' | 'move' | 'skill' | 'shoot';
  onMapClick: (position: Position) => void;
  onPlayerSelect: (playerId: string | null) => void;
}

export default function MapCanvas({ 
  map, 
  players,
  actions,
  currentTime,
  selectedPlayerId,
  selectedTool, 
  onMapClick,
  onPlayerSelect
}: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [playerPositions, setPlayerPositions] = useState<Record<string, Position>>({});

  // 캔버스 크기 조정
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const width = container.clientWidth - 32; // 패딩 고려
        const height = Math.min(width * 0.75, 600); // 4:3 비율, 최대 600px
        setCanvasSize({ width, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 현재 시간에 따른 플레이어 위치 계산
  useEffect(() => {
    const newPositions: Record<string, Position> = {};
    
    players.forEach(player => {
      // 기본 위치 (스폰 지점)
      const spawnX = player.team === 'attack' ? 0.1 : 0.9;
      const spawnY = 0.5 + (Math.random() - 0.5) * 0.3;
      
      let currentPosition: Position = { x: spawnX, y: spawnY };
      
      // 현재 시간까지의 모든 이동 액션을 찾아서 마지막 위치 적용
      const playerActions = actions
        .filter(action => action.playerId === player.id && action.timestamp <= currentTime)
        .sort((a, b) => a.timestamp - b.timestamp);
      
      const lastMoveAction = playerActions.reverse().find(action => action.type === 'move');
      if (lastMoveAction) {
        currentPosition = lastMoveAction.position;
      }
      
      newPositions[player.id] = currentPosition;
    });
    
    setPlayerPositions(newPositions);
  }, [players, actions, currentTime]);

  // 캔버스 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !map) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // 배경 지우기
    ctx.fillStyle = '#0f1419';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 맵 배경 그리기
    const mapImage = new Image();
    mapImage.onload = () => {
      ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
      drawPlayers(ctx);
      drawActions(ctx);    };
    mapImage.onerror = () => {
      // 맵 이미지 로드 실패시 기본 배경
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 격자 그리기
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      drawPlayers(ctx);
      drawActions(ctx);
    };
    
    if (map.viewImageUrl.startsWith('/')) {
      mapImage.src = map.viewImageUrl;
    } else {
      // 이미지가 없는 경우 바로 오류 처리
      mapImage.onerror(new Event('error') as any);
    }

  }, [map, canvasSize, playerPositions, selectedPlayerId]);

  const drawPlayers = (ctx: CanvasRenderingContext2D) => {
    players.forEach(player => {
      const position = playerPositions[player.id];
      if (!position) return;

      const x = position.x * canvasSize.width;
      const y = position.y * canvasSize.height;

      // 플레이어 원 그리기
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = player.color;
      ctx.fill();
      
      // 선택된 플레이어 강조
      if (selectedPlayerId === player.id) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 선택 효과
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = player.team === 'attack' ? '#ff6b6b' : '#4ecdc4';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 플레이어 이름 그리기
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText(player.agent, x, y - 25);
      ctx.fillText(player.agent, x, y - 25);
      
      // 팀 표시
      ctx.font = '10px Arial';
      ctx.fillStyle = player.team === 'attack' ? '#ff6b6b' : '#4ecdc4';
      ctx.fillText(player.team === 'attack' ? 'ATK' : 'DEF', x, y + 35);
    });
  };

  const drawActions = (ctx: CanvasRenderingContext2D) => {
    // 현재 시간 근처의 액션들만 표시
    const visibleActions = actions.filter(action => 
      Math.abs(action.timestamp - currentTime) < 2000 // 2초 범위
    );

    visibleActions.forEach(action => {
      const x = action.position.x * canvasSize.width;
      const y = action.position.y * canvasSize.height;
      
      // 액션 타입별 아이콘
      let icon = '';
      let color = '';
      
      switch (action.type) {
        case 'skill':
          icon = '⚡';
          color = '#ffe66d';
          break;
        case 'shoot':
          icon = '🎯';
          color = '#ff6b6b';
          break;
        case 'plant':
          icon = '💣';
          color = '#ff9f43';
          break;
        case 'defuse':
          icon = '🔧';
          color = '#0abde3';
          break;
        default:
          return;
      }
      
      // 액션 마커 그리기
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // 아이콘 텍스트
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(icon, x, y + 4);
    });
  };

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / canvas.width;
    const y = (event.clientY - rect.top) / canvas.height;

    // 클릭한 위치에 플레이어가 있는지 확인
    const clickedPlayer = players.find(player => {
      const position = playerPositions[player.id];
      if (!position) return false;
      
      const playerX = position.x * canvasSize.width;
      const playerY = position.y * canvasSize.height;
      const canvasX = event.clientX - rect.left;
      const canvasY = event.clientY - rect.top;
      
      const distance = Math.sqrt(
        Math.pow(canvasX - playerX, 2) + Math.pow(canvasY - playerY, 2)
      );
      
      return distance <= 20; // 플레이어 반지름
    });

    if (clickedPlayer) {
      // 플레이어 클릭
      onPlayerSelect(clickedPlayer.id === selectedPlayerId ? null : clickedPlayer.id);
    } else {
      // 맵 클릭
      onMapClick({ x, y });
    }
  }, [players, playerPositions, canvasSize, selectedPlayerId, onPlayerSelect, onMapClick]);

  if (!map) {
    return (
      <div className="map-canvas-container">
        <div className="map-loading">
          맵을 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="map-canvas-container" ref={containerRef}>
      <div className="map-header">
        <h3>{map.name}</h3>
        <div className="map-stats">
          <span>{players.length} 플레이어</span>
          <span>도구: {selectedTool}</span>
        </div>
      </div>
      
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onClick={handleCanvasClick}
          className="map-canvas"
        />
      </div>
      
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color attack"></div>
          <span>공격팀</span>
        </div>
        <div className="legend-item">
          <div className="legend-color defense"></div>
          <span>수비팀</span>
        </div>
      </div>
    </div>
  );
}
