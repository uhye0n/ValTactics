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
function MapCard({ image, name }: { image: string; name: string }) {
  return (
    <div className="map-card">
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

function MapSelection() {
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
              <MapCard key={map.name} image={map.image} name={map.name} />
            ))}
          </div>
          <div className="map-grid map-grid-bottom">
            {maps.slice(6).map((map) => (
              <MapCard key={map.name} image={map.image} name={map.name} />
            ))}
          </div>
        </div>
        
        <UnderlineWithHighlights />
      </div>
    </section>
  );
}

// Agent Selection Component
function AgentProfile({ image }: { image: string; name: string }) {
  return (
    <div className="agent-profile">
      <div
        className="agent-profile-image"
        style={{ backgroundImage: `url('${image}')` }}
      />
    </div>
  );
}

function AgentSection({ title, teamType }: { title: string; teamType: 'our' | 'enemy' }) {
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

  return (
    <section className="section-container">
      <div className="content-width">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <UnderlineWithHighlights />
        </div>
        
        <div className="agent-grid-container">
          <div className="agent-grid">
            {agents.slice(0, 10).map((agent, index) => (
              <AgentProfile
                key={`${teamType}-${agent.name}-${index}`}
                image={agent.image}
                name={agent.name}
              />
            ))}
          </div>
          
          <div className="agent-grid">
            {agents.slice(10, 20).map((agent, index) => (
              <AgentProfile
                key={`${teamType}-${agent.name}-${index + 10}`}
                image={agent.image}
                name={agent.name}
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
function GenerateButton() {
  const handleGenerate = () => {
    // TODO: Implement scenario generation logic
    console.log("Generate scenario clicked");
  };

  return (
    <section className="section-container compact-spacing">
      <div className="content-width">        <div className="generate-button-container">
          <div className="generate-button" onClick={handleGenerate}>
            <div className="generate-button-background" />
            <div className="generate-button-text">
              GENERATE SCENARIO
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function NewScenario() {
  return (
    <div className="new-scenario">
      {/* Background */}
      <div
        className="new-scenario-background"
        style={{ backgroundImage: `url('${backgroundImg}')` }}
      />
      
      {/* Content */}
      <div className="new-scenario-content">
        <MapSelection />
        <AgentSection title="우리 팀 요원" teamType="our" />
        <AgentSection title="상대 팀 요원" teamType="enemy" />
        <TemplateSection />
        <GenerateButton />
      </div>
    </div>
  );
}
