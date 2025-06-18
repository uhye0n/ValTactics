import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import './MyScenarios/MyScenarios.css';

interface Scenario {
  id: string;
  title: string;
  description?: string;
  mapId: string;
  mapName: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

const MyScenarios: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // 시나리오 목록 가져오기
  useEffect(() => {
    loadMyScenarios();
  }, []);
  const loadMyScenarios = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiService.getMyScenarios({
        limit: 20
      }) as any;
      
      setScenarios(response.scenarios || []);
    } catch (error: any) {
      console.error('내 시나리오 로드 실패:', error);
      setError(error.message || '시나리오 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };  // 시나리오 삭제
  const handleDeleteScenario = async (scenarioId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    e.preventDefault();
    
    console.log('삭제 버튼 클릭됨:', scenarioId);
    
    if (!confirm('정말로 이 시나리오를 삭제하시겠습니까?')) {
      console.log('삭제 취소됨');
      return;
    }

    try {
      console.log('시나리오 삭제 시도:', scenarioId);
      await apiService.deleteScenario(scenarioId);
      console.log('시나리오 삭제 성공');
      setScenarios(prev => prev.filter(scenario => scenario.id !== scenarioId));
    } catch (error: any) {
      console.error('시나리오 삭제 실패:', error);
      setError('시나리오 삭제에 실패했습니다.');
    }
  };

  const handleScenarioClick = (scenarioId: string) => {
    navigate(`/editor/${scenarioId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMapDisplayName = (mapId: string) => {
    const mapNames: { [key: string]: string } = {
      'abyss': 'ABYSS',
      'ascent': 'ASCENT',
      'bind': 'BIND',
      'breeze': 'BREEZE',
      'fracture': 'FRACTURE',
      'haven': 'HAVEN',
      'icebox': 'ICEBOX',
      'lotus': 'LOTUS',
      'pearl': 'PEARL',
      'split': 'SPLIT',
      'sunset': 'SUNSET'
    };
    return mapNames[mapId] || mapId.toUpperCase();
  };

  if (!user) {
    return (
      <div className="my-scenarios-container">
        <div className="login-required">
          <h2>로그인이 필요합니다</h2>
          <p>내 시나리오를 보려면 로그인해주세요.</p>
        </div>
      </div>
    );
  }
  return (    <div className="my-scenarios-container">

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={() => setError('')} className="close-button">×</button>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>시나리오를 불러오는 중...</p>
        </div>
      ) : scenarios.length === 0 ? (
        <div className="empty-state">
          <h3>아직 생성한 시나리오가 없습니다</h3>
          <p>새로운 시나리오를 만들어보세요!</p>
          <button 
            onClick={() => navigate('/new-scenario')} 
            className="create-scenario-button"
          >
            시나리오 만들기
          </button>
        </div>
      ) : (
        <div className="scenarios-grid">
          {scenarios.map((scenario) => (
            <div 
              key={scenario.id} 
              className="scenario-card"
              onClick={() => handleScenarioClick(scenario.id)}
            >              <div className="scenario-header">
                <h3 className="scenario-title">{scenario.title}</h3>
                <div className="scenario-actions">
                  <div className="scenario-status">
                    {scenario.isPublic ? (
                      <span className="status-badge public">공개</span>
                    ) : (
                      <span className="status-badge private">비공개</span>
                    )}
                  </div>
                  <button 
                    className="delete-button"
                    onClick={(e) => handleDeleteScenario(scenario.id, e)}
                    aria-label="시나리오 삭제"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="scenario-info">
                <div className="map-info">
                  <span className="map-label">맵:</span>
                  <span className="map-name">{getMapDisplayName(scenario.mapId)}</span>
                </div>
                
                {scenario.description && (
                  <p className="scenario-description">{scenario.description}</p>
                )}
              </div>
              
              <div className="scenario-footer">
                <div className="dates">
                  <span className="created-date">생성: {formatDate(scenario.createdAt)}</span>
                  {scenario.updatedAt !== scenario.createdAt && (
                    <span className="updated-date">수정: {formatDate(scenario.updatedAt)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyScenarios;
