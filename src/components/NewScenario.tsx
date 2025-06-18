import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useScenario } from '../contexts/ScenarioContext';
import apiService from '../services/api';
import "./NewScenario/NewScenario.css";

// Import placeholder images - replace with actual paths when available
const backgroundImg = "/resources/background.png";

// Agent images - update paths when actual images are available
const agentImages = {
  astra: "/resources/images/agent/Astra.png",
  breach: "/resources/images/agent/Breach.png",
  brimstone: "/resources/images/agent/Brimstone.png",
  chamber: "/resources/images/agent/Chamber.png",
  cypher: "/resources/images/agent/Cypher.png",
  fade: "/resources/images/agent/Fade.png",
  harbor: "/resources/images/agent/Harbor.png",
  jett: "/resources/images/agent/Jett.png",
  kayo: "/resources/images/agent/KayO.png",
  killjoy: "/resources/images/agent/Killjoy.png",
  neon: "/resources/images/agent/Neon.png",
  omen: "/resources/images/agent/Omen.png",
  phoenix: "/resources/images/agent/Phoenix.png",
  raze: "/resources/images/agent/Raze.png",
  reyna: "/resources/images/agent/Reyna.png",
  sage: "/resources/images/agent/Sage.png",
  skye: "/resources/images/agent/Skye.png",
  sova: "/resources/images/agent/Sova.png",
  viper: "/resources/images/agent/Viper.png",
  yoru: "/resources/images/agent/Yoru.png",
};

// Map images - using view images from resources
const mapImages = {
  abyss: "/resources/images/view/Abyss.webp",
  ascent: "/resources/images/view/Ascent.webp",
  bind: "/resources/images/view/Bind.webp",
  breeze: "/resources/images/view/Breeze.webp",
  fracture: "/resources/images/view/Fracture.webp",
  haven: "/resources/images/view/Haven.webp",
  icebox: "/resources/images/view/Icebox.webp",
  lotus: "/resources/images/view/Lotus.webp",
  pearl: "/resources/images/view/Pearl.webp",
  split: "/resources/images/view/Split.webp",
  sunset: "/resources/images/view/Sunset.webp",
};

// Agent name mapping for URL parameters
const agentNameToId: { [key: string]: string } = {
  'Astra': 'astra',
  'Breach': 'breach',
  'Brimstone': 'brimstone',
  'Chamber': 'chamber',
  'Cypher': 'cypher',
  'Fade': 'fade',
  'Harbor': 'harbor',
  'Jett': 'jett',
  'KAY/O': 'kayo',
  'Killjoy': 'killjoy',
  'Neon': 'neon',
  'Omen': 'omen',
  'Phoenix': 'phoenix',
  'Raze': 'raze',
  'Reyna': 'reyna',
  'Sage': 'sage',
  'Skye': 'skye',
  'Sova': 'sova',
  'Viper': 'viper',
  'Yoru': 'yoru'
};

// Map name to ID mapping
const mapNameToId: { [key: string]: string } = {
  'ABYSS': 'abyss',
  'ASCENT': 'ascent',
  'BIND': 'bind',
  'BREEZE': 'breeze',
  'FRACTURE': 'fracture',
  'HAVEN': 'haven',
  'ICEBOX': 'icebox',
  'LOTUS': 'lotus',
  'PEARL': 'pearl',
  'SPLIT': 'split',
  'SUNSET': 'sunset'
};

// Shared underline component
function UnderlineWithHighlights({ width = 909, className = "" }: { width?: number; className?: string }) {
  return (
    <div className={`underline-with-highlights ${className}`} style={{ width: `${width}px` }}>
      <svg
        className="underline-svg"
        fill="none"
        preserveAspectRatio="none"
        viewBox={`0 0 ${width} 1`}
      >
        <line stroke="#8A98A2" x1="0" x2={width} y1="0.5" y2="0.5" />
        <line stroke="rgba(255, 255, 255, 0.59)" x1="0" x2="11.88" y1="0.5" y2="0.5" />
        <line stroke="rgba(255, 255, 255, 0.6)" x1={width - 11.88} x2={width} y1="0.5" y2="0.5" />
      </svg>
    </div>
  );
}

// Map Selection Component
function MapCard({ 
  image, 
  name, 
  isSelected, 
  onSelect 
}: { 
  image: string; 
  name: string; 
  isSelected: boolean;
  onSelect: (name: string) => void;
}) {
  return (
    <div 
      className={`map-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(name)}
    >
      <div
        className="map-card-background"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="map-card-overlay">
        <span className="map-card-name">{name}</span>
      </div>
    </div>
  );
}

function MapSelection({ 
  onMapSelect, 
  selectedMap 
}: { 
  onMapSelect: (mapName: string) => void;
  selectedMap: string;
}) {
  const maps = [
    { image: mapImages.abyss, name: "ABYSS" },
    { image: mapImages.ascent, name: "ASCENT" },
    { image: mapImages.bind, name: "BIND" },
    { image: mapImages.breeze, name: "BREEZE" },
    { image: mapImages.fracture, name: "FRACTURE" },
    { image: mapImages.haven, name: "HAVEN" },
    { image: mapImages.icebox, name: "ICEBOX" },
    { image: mapImages.lotus, name: "LOTUS" },
    { image: mapImages.pearl, name: "PEARL" },
    { image: mapImages.split, name: "SPLIT" },
    { image: mapImages.sunset, name: "SUNSET" },
  ];

  return (
    <section className="section-container">
      <div className="content-width">
        <div className="section-header">
          <h2 className="section-title">맵 선택</h2>
          <UnderlineWithHighlights />
        </div>
        
        <div className="map-grid-container">
          <div className="map-grid map-grid-top">
            {maps.slice(0, 6).map((map) => (
              <MapCard 
                key={map.name} 
                image={map.image} 
                name={map.name}
                isSelected={selectedMap === map.name}
                onSelect={onMapSelect}
              />
            ))}
          </div>
          <div className="map-grid map-grid-bottom">
            {maps.slice(6).map((map) => (
              <MapCard 
                key={map.name} 
                image={map.image} 
                name={map.name}
                isSelected={selectedMap === map.name}
                onSelect={onMapSelect}
              />
            ))}
          </div>
        </div>
        
        <UnderlineWithHighlights />
      </div>
    </section>
  );
}

// Agent Selection Component
function AgentProfile({ 
  image, 
  name, 
  isSelected, 
  onSelect 
}: { 
  image: string; 
  name: string; 
  isSelected: boolean;
  onSelect: (name: string) => void;
}) {
  return (
    <div 
      className={`agent-profile ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(name)}
    >
      <div
        className="agent-profile-image"
        style={{ backgroundImage: `url('${image}')` }}
      />
    </div>
  );
}

function AgentSection({ 
  title, 
  teamType, 
  onAgentSelect, 
  selectedAgents 
}: { 
  title: string; 
  teamType: 'our' | 'enemy';
  onAgentSelect: (agentName: string, isOurTeam: boolean) => void;
  selectedAgents: string[];
}) {
  const agents = [
    { image: agentImages.astra, name: "Astra" },
    { image: agentImages.breach, name: "Breach" },
    { image: agentImages.brimstone, name: "Brimstone" },
    { image: agentImages.chamber, name: "Chamber" },
    { image: agentImages.cypher, name: "Cypher" },
    { image: agentImages.jett, name: "Jett" },
    { image: agentImages.killjoy, name: "Killjoy" },
    { image: agentImages.neon, name: "Neon" },
    { image: agentImages.omen, name: "Omen" },
    { image: agentImages.phoenix, name: "Phoenix" },
    { image: agentImages.skye, name: "Skye" },
    { image: agentImages.sova, name: "Sova" },
    { image: agentImages.viper, name: "Viper" },
    { image: agentImages.yoru, name: "Yoru" },
    { image: agentImages.kayo, name: "KAY/O" },
    { image: agentImages.fade, name: "Fade" },
    { image: agentImages.harbor, name: "Harbor" },
    { image: agentImages.raze, name: "Raze" },
    { image: agentImages.reyna, name: "Reyna" },
    { image: agentImages.sage, name: "Sage" },
  ];

  const handleAgentClick = (agentName: string) => {
    onAgentSelect(agentName, teamType === 'our');
  };

  return (
    <section className="section-container">
      <div className="content-width">
        <div className="section-header">
          <h2 className="section-title">{title} ({selectedAgents.length}/5)</h2>
          <UnderlineWithHighlights />
        </div>
        
        <div className="agent-grid-container">
          <div className="agent-grid">
            {agents.slice(0, 10).map((agent, index) => (
              <AgentProfile
                key={`${teamType}-${agent.name}-${index}`}
                image={agent.image}
                name={agent.name}
                isSelected={selectedAgents.includes(agent.name)}
                onSelect={handleAgentClick}
              />
            ))}
          </div>
          
          <div className="agent-grid">
            {agents.slice(10, 20).map((agent, index) => (
              <AgentProfile
                key={`${teamType}-${agent.name}-${index + 10}`}
                image={agent.image}
                name={agent.name}
                isSelected={selectedAgents.includes(agent.name)}
                onSelect={handleAgentClick}
              />
            ))}
          </div>
        </div>
        
        <UnderlineWithHighlights />
      </div>
    </section>
  );
}

// Template Component
function TemplateCard({ title, agents, backgroundImage }: { title: string; agents: string; backgroundImage: string }) {
  return (
    <div className="template-card">
      {/* Background border */}
      <div className="template-card-border" />
      
      {/* Background image with opacity */}
      <div
        className="template-card-image"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      
      <div className="template-card-content">
        <h3 className="template-card-title">{title}</h3>
        <div className="template-card-underline-group">
          <div className="template-card-line-main" />
          <div className="template-card-line-left" />
          <div className="template-card-line-right" />
        </div>        <p className="template-card-agents">{agents}</p>
        
        {/* Diamond icon */}
        <div className="template-card-diamond">
          <div 
            className="template-card-crosshair"
            style={{ backgroundImage: `url('/resources/images/crosshair.png')` }}
          />
        </div>
      </div>
      
      {/* Corner squares */}
      <div className="template-card-corner top-left" />
      <div className="template-card-corner top-right" />
      <div className="template-card-corner bottom-left" />
      <div className="template-card-corner bottom-right" />
    </div>
  );
}

function TemplateSection() {
  const templates = [
    { 
      title: "ASCENT ATTACK", 
      agents: "Jett / Fade / KayO / KillJoy / Omen",
      backgroundImage: "/resources/images/view/Ascent.webp"
    },
    { 
      title: "BIND ATTACK", 
      agents: "Jett / Fade / KayO / KillJoy / Omen",
      backgroundImage: "/resources/images/view/Bind.webp"
    },
    { 
      title: "HAVEN ATTACK", 
      agents: "Jett / Fade / KayO / KillJoy / Omen",
      backgroundImage: "/resources/images/view/Haven.webp"
    },
  ];

  return (
    <section className="section-container">
      <div className="content-width">
        <div className="section-header">
          <h2 className="section-title">템플릿</h2>
          <UnderlineWithHighlights />
        </div>
        
        <div className="template-grid">
          {templates.map((template) => (
            <TemplateCard 
              key={template.title} 
              title={template.title} 
              agents={template.agents}
              backgroundImage={template.backgroundImage}
            />
          ))}
        </div>
        
        <UnderlineWithHighlights />
      </div>
    </section>
  );
}

// Generate Button Component
function GenerateButton({ 
  onGenerate, 
  isLoading, 
  error,
  onClearError
}: { 
  onGenerate: () => void;
  isLoading: boolean;
  error: string;
  onClearError: () => void;
}) {
  return (
    <section className="section-container compact-spacing">
      <div className="content-width">        {error && (
          <div style={{
            backgroundColor: '#ff4444',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: 'bold',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span>{error}</span>            <button
              onClick={onClearError}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '0',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="닫기"
            >
              ×
            </button>
          </div>
        )}
        <div className="generate-button-container">
          <div 
            className={`generate-button ${isLoading ? 'loading' : ''}`} 
            onClick={isLoading ? undefined : onGenerate}
            style={{ 
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            <div className="generate-button-background" />
            <div className="generate-button-text">
              {isLoading ? 'GENERATING...' : 'GENERATE SCENARIO'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function NewScenario() {
  const navigate = useNavigate();
  const [selectedMap, setSelectedMap] = useState<string>('');
  const [ourAgents, setOurAgents] = useState<string[]>([]);
  const [enemyAgents, setEnemyAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleMapSelect = (mapName: string) => {
    setSelectedMap(mapName);
  };

  const handleAgentSelect = (agentName: string, isOurTeam: boolean) => {
    if (isOurTeam) {
      setOurAgents(prev => {
        if (prev.includes(agentName)) {
          return prev.filter(agent => agent !== agentName);
        } else if (prev.length < 5) {
          return [...prev, agentName];
        }
        return prev;
      });
    } else {
      setEnemyAgents(prev => {
        if (prev.includes(agentName)) {
          return prev.filter(agent => agent !== agentName);
        } else if (prev.length < 5) {
          return [...prev, agentName];
        }
        return prev;
      });
    }
  };  const handleGenerateScenario = async () => {
    if (!selectedMap || ourAgents.length !== 5 || enemyAgents.length !== 5) {
      setError('맵 1개와 각 팀의 요원 5명을 모두 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 백엔드에 시나리오 생성 요청
      const response = await apiService.createScenario({
        title: `${selectedMap} 전략`,
        description: `${selectedMap} 맵에서의 전략 시나리오`,
        mapId: mapNameToId[selectedMap],
        mapName: selectedMap,
        isPublic: false,
        ourTeam: ourAgents.map((agent, index) => ({
          agentName: agent,
          agentRole: getAgentRole(agent), // 요원 역할 함수 필요
          position: index
        })),
        enemyTeam: enemyAgents.map((agent, index) => ({
          agentName: agent,
          agentRole: getAgentRole(agent),
          position: index
        }))
      });

      const scenario = response as any;
      
      // 시나리오 에디터로 이동 (URL 파라미터로 ID 전달)
      navigate(`/editor/${scenario.id}`);
      
    } catch (error: any) {
      console.error('시나리오 생성 실패:', error);
      setError(error.message || '시나리오 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 요원 역할 결정 함수 (임시)
  const getAgentRole = (agentName: string): string => {
    // 실제로는 상수에서 가져와야 함
    const roles: Record<string, string> = {
      'Jett': 'Duelist',
      'Phoenix': 'Duelist', 
      'Reyna': 'Duelist',
      'Raze': 'Duelist',
      'Sage': 'Sentinel',
      'Killjoy': 'Sentinel',
      'Cypher': 'Sentinel',
      'Chamber': 'Sentinel',
      'Sova': 'Initiator',
      'Breach': 'Initiator',
      'Skye': 'Initiator',
      'KAY/O': 'Initiator',
      'Omen': 'Controller',
      'Brimstone': 'Controller',
      'Viper': 'Controller',
      'Astra': 'Controller'
    };
    return roles[agentName] || 'Duelist';
  };

  // 오류 메시지를 5초 후에 자동으로 사라지게 함
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="new-scenario">
      {/* Background */}
      <div
        className="new-scenario-background"
        style={{ backgroundImage: `url('${backgroundImg}')` }}
      />
      
      {/* Content */}
      <div className="new-scenario-content">
        <MapSelection onMapSelect={handleMapSelect} selectedMap={selectedMap} />
        <AgentSection 
          title="우리 팀 요원" 
          teamType="our" 
          onAgentSelect={handleAgentSelect}
          selectedAgents={ourAgents}
        />
        <AgentSection 
          title="상대 팀 요원" 
          teamType="enemy" 
          onAgentSelect={handleAgentSelect}
          selectedAgents={enemyAgents}
        />
        <TemplateSection />        <GenerateButton 
          onGenerate={handleGenerateScenario} 
          isLoading={isLoading}
          error={error}
          onClearError={() => setError('')}
        />
      </div>
    </div>
  );
}
