import svgPaths from "./imports/svg-xzxk7hou0o";
import imgImage from "figma:asset/8cc5bf21b2f64dbb5c10b51551d5da3d00120aea.png";
import imgAstra from "figma:asset/90827659ce7184fa664f3965ae5222a770d6eb40.png";
import imgSkye from "figma:asset/e5054582b0c5227f3f7b95a1091efab464d45cb2.png";
import imgBreach from "figma:asset/a689e394c06ce8fbca2f24674af98795f813c1dc.png";
import imgSova from "figma:asset/133050e00b4e4d5c7f72344447bd55bab9e068a5.png";
import imgBrimstone from "figma:asset/aa01ab5b904b9e0ee4b6c86a7203e682563d6dbf.png";
import imgViper from "figma:asset/2e3ef397f539cc01356210cec0e1543b6933deec.png";
import imgChamber from "figma:asset/62b646a33f0cab8693d0e51040e27aa15699b6af.png";
import imgYoru from "figma:asset/657216ed90c55d06ebdacd66e67be1ee90991cef.png";
import imgCypher from "figma:asset/7951636eaa63207e4e26a9887a50928ba98c2ec7.png";
import imgKayO from "figma:asset/aacdc48a495f45d6168bee818dc1ed68af73dac9.png";
import imgJett from "figma:asset/664aa1877744ff626cdb6c10af335941dd8c3e2e.png";
import imgImage2 from "figma:asset/7cebe425b81cd97728d8e9f81dbfc686b7632e87.png";
import imgKilljoy from "figma:asset/c075661db7904146d9cedad71d1bd81cc42c8060.png";
import imgImage3 from "figma:asset/3f23bf55a97ce2d47be37e0e36571af847e46596.png";
import imgNeon from "figma:asset/803dc7050e393ccaccc02406f6c1e274b63032d9.png";
import imgOmen from "figma:asset/fd6db06d7b4468c96803370000b4ebc94a4c5cc9.png";
import imgPhoenix from "figma:asset/8a746b35d4f32b3c168e707b0625b902c22d334e.png";
import imgRaze from "figma:asset/0de7e59d9221c3e19b920fd518303d1cabf13fc1.png";
import imgReyna from "figma:asset/4c34d1baf59eafb38e24cc70defc1dfe12ad06a2.png";
import imgSage from "figma:asset/2bdb3dabb0d42dbf85d79834eb64e10810f2194b.png";
import imgPearl from "figma:asset/9c077594d16a50720d722bd9afcb97025ff742b3.png";
import imgAscent from "figma:asset/7108480913c525772267f19e3af282700ea3e425.png";
import imgBind from "figma:asset/7f5d745ad6ba6e799481304848673dc5529ee7b4.png";
import imgBreeze from "figma:asset/8b6102506c09b5cdaf40e5de689bfb9dd5d92da9.png";
import imgFracture from "figma:asset/b394d81f87f48dbaba619f05e6d70cbb9a771212.png";
import imgHaven from "figma:asset/7185fd14b2e1ebdda8bccc21dac61f833a8e0a0c.png";
import imgIcebox from "figma:asset/bd10ee3e787a29315aae6608dbda517c21e80776.png";
import imgLotus from "figma:asset/d646e3b05ed85ae6cfc67f6bc3166cde7eb13d5a.png";
import imgSplit from "figma:asset/f303e67285d34fbdfe422738468451d65cde596c.png";
import imgImage13 from "figma:asset/9afb11c90644951df50d7d1f72b381b21409b827.png";
import img from "figma:asset/38d7edf0da5cd5166c7b6989064e5fa26d117285.png";

// Constants for consistent layout
const CONTENT_WIDTH = 909;
const SECTION_SPACING = 64; // py-16
const HEADER_HEIGHT = 120;

// Shared underline component with proper highlights
function UnderlineWithHighlights({ width = CONTENT_WIDTH, className = "" }: { width?: number; className?: string }) {
  return (
    <div className={`relative h-px mx-auto ${className}`} style={{ width: `${width}px` }}>
      <svg
        className="block size-full"
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

// Section container for consistent layout
function SectionContainer({ children, spacing = "standard" }: { children: React.ReactNode; spacing?: "standard" | "header" | "compact" }) {
  const paddingClass = spacing === "header" ? "py-8" : spacing === "compact" ? "py-8" : "py-16";
  return (
    <section className={`w-full ${paddingClass}`}>
      <div className="w-[909px] mx-auto">
        {children}
      </div>
    </section>
  );
}

// Navigation Header Component
function NavigationHeader() {
  return (
    <SectionContainer spacing="header">
      <div className="relative h-16">
        {/* Left Navigation */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-8">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 26 32"
              >
                <path d="M16 1L1 16" stroke="white" strokeLinecap="round" strokeWidth="2" />
                <path d="M16 31L1 16" stroke="white" strokeLinecap="round" strokeWidth="2" />
                <path d={svgPaths.p3432f100} fill="#393C40" fillOpacity="0.8" />
                <circle cx="12" cy="16" fill="white" r="2" />
              </svg>
            </div>
            <span className="font-['Akshar:Medium',_sans-serif] font-medium text-[#797d7c] text-[15px] whitespace-nowrap">
              뒤로가기
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 flex items-center justify-center">
              <div className="w-4 h-0 border-t-2 border-white rotate-[111deg]" />
            </div>
            <div className="w-3 h-3 flex items-center justify-center">
              <div className="w-4 h-0 border-t-2 border-white rotate-[111deg]" />
            </div>
          </div>
          
          <span className="font-['Akshar:Bold',_sans-serif] font-bold text-white text-[18px] tracking-[3.6px] whitespace-nowrap">
            메인화면
          </span>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="font-['Gajraj_One:Regular',_sans-serif] text-white text-[30px] whitespace-nowrap">
            <span className="text-[#fc4754]">V</span>a<span className="text-[#fc4754]">l</span>Tactics
          </div>
          <UnderlineWithHighlights width={168} className="mt-2" />
        </div>

        {/* Right Login */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end">
          <span className="font-['Akshar:Bold',_sans-serif] font-bold text-white text-[18px] tracking-[3.6px] whitespace-nowrap">
            로그인
          </span>
          <UnderlineWithHighlights width={57} className="mt-2" />
        </div>
      </div>
    </SectionContainer>
  );
}

// Map Selection Components
function MapCard({ image, name }: { image: string; name: string }) {
  return (
    <div className="relative h-20 rounded-lg overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%), url('${image}')`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="font-['FONTSPRING_DEMO_-_Anguita_Sans_Black:Regular',_sans-serif] text-white text-[18px] leading-[37px] tracking-[0.12em] text-center"
          style={{ 
            fontWeight: 900,
            textShadow: '0px 1px 24px rgba(255, 255, 255, 0.5)'
          }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}

function MapSelection() {
  const maps = [
    { image: "/resources/images/view/Abyss.webp", name: "ABYSS" },
    { image: "/resources/images/view/Ascent.webp", name: "ASCENT" },
    { image: "/resources/images/view/Bind.webp", name: "BIND" },
    { image: "/resources/images/view/Breeze.webp", name: "BREEZE" },
    { image: "/resources/images/view/Fracture.webp", name: "FRACTURE" },
    { image: "/resources/images/view/Haven.webp", name: "HAVEN" },
    { image: "/resources/images/view/Icebox.webp", name: "ICEBOX" },
    { image: "/resources/images/view/Lotus.webp", name: "LOTUS" },
    { image: "/resources/images/view/Pearl.webp", name: "PEARL" },
    { image: "/resources/images/view/Split.webp", name: "SPLIT" },
    { image: "/resources/images/view/Sunset.webp", name: "SUNSET" },
  ];

  return (
    <SectionContainer>
      <div className="space-y-6">
        <div>
          <h2 className="font-['Fascinate:Regular',_sans-serif] text-white text-[20px] mb-4">맵 선택</h2>
          <UnderlineWithHighlights />
        </div>
        
        <div className="grid grid-cols-5 gap-4">
          {maps.map((map) => (
            <MapCard key={map.name} image={map.image} name={map.name} />
          ))}
        </div>
        
        <UnderlineWithHighlights />
      </div>
    </SectionContainer>
  );
}

// Agent Selection Components
function AgentProfile({ image, name }: { image: string; name: string }) {
  return (
    <div className="w-16 h-16 border border-white relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      />
    </div>
  );
}

function AgentSection({ title, teamType }: { title: string; teamType: 'our' | 'enemy' }) {
  const agents = [
    { image: imgAstra, name: "Astra" },
    { image: imgBreach, name: "Breach" },
    { image: imgBrimstone, name: "Brimstone" },
    { image: imgChamber, name: "Chamber" },
    { image: imgCypher, name: "Cypher" },
    { image: imgJett, name: "Jett" },
    { image: imgKilljoy, name: "Killjoy" },
    { image: imgNeon, name: "Neon" },
    { image: imgOmen, name: "Omen" },
    { image: imgPhoenix, name: "Phoenix" },
    { image: imgSkye, name: "Skye" },
    { image: imgSova, name: "Sova" },
    { image: imgViper, name: "Viper" },
    { image: imgYoru, name: "Yoru" },
    { image: imgKayO, name: "KAY/O" },
    { image: imgImage2, name: "Fade" },
    { image: imgImage3, name: "Harbor" },
    { image: imgRaze, name: "Raze" },
    { image: imgReyna, name: "Reyna" },
    { image: imgSage, name: "Sage" },
  ];

  return (
    <SectionContainer>
      <div className="space-y-6">
        <div>
          <h2 className="font-['Fascinate:Regular',_sans-serif] text-white text-[20px] mb-4">{title}</h2>
          <UnderlineWithHighlights />
        </div>
        
        {/* Agent grid with precise alignment */}
        <div className="flex flex-col gap-4">
          {/* First row - 10 agents */}
          <div className="grid grid-cols-10 justify-between" style={{ gap: '29px' }}>
            {agents.slice(0, 10).map((agent, index) => (
              <AgentProfile
                key={`${teamType}-${agent.name}-${index}`}
                image={agent.image}
                name={agent.name}
              />
            ))}
          </div>
          
          {/* Second row - 10 agents */}
          <div className="grid grid-cols-10 justify-between" style={{ gap: '29px' }}>
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
    </SectionContainer>
  );
}

// Template Components
function TemplateCard({ title, agents }: { title: string; agents: string }) {
  return (
    <div className="w-[220px] h-[155px] border border-[#87919b] relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.07]"
        style={{ backgroundImage: `url('${imgImage}')` }}
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-start p-6">
        <h3 className="font-['Akshar:Bold',_sans-serif] font-bold text-white text-[15px] tracking-[1.8px] text-center mb-4">
          {title}
        </h3>
        
        <p className="font-['Akshar:Light',_sans-serif] font-light text-white text-[12px] tracking-[0.7px] text-center mb-6">
          {agents}
        </p>
        
        <UnderlineWithHighlights width={182} className="mb-6" />
        
        <div className="w-4 h-4 border border-white rotate-45 bg-transparent" />
      </div>
      
      {/* Corner dots */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-[#d9d9d9]" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-[#d9d9d9]" />
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-[#d9d9d9]" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#d9d9d9]" />
    </div>
  );
}

function TemplateSection() {
  const templates = [
    { title: "ASCENT ATTACK", agents: "Jett / Fade / KayO / KillJoy / Omen" },
    { title: "BIND ATTACK", agents: "Jett / Fade / KayO / KillJoy / Omen" },
    { title: "HAVEN ATTACK", agents: "Jett / Fade / KayO / KillJoy / Omen" },
  ];

  return (
    <SectionContainer>
      <div className="space-y-6">
        <div>
          <h2 className="font-['Fascinate:Regular',_sans-serif] text-white text-[20px] mb-4">템플릿</h2>
          <UnderlineWithHighlights />
        </div>
        
        <div className="flex justify-center gap-8">
          {templates.map((template) => (
            <TemplateCard key={template.title} title={template.title} agents={template.agents} />
          ))}
        </div>
        
        <UnderlineWithHighlights />
      </div>
    </SectionContainer>
  );
}

// Generate Button Component
function GenerateButton() {
  return (
    <SectionContainer spacing="compact">
      <div className="flex justify-center">
        <div className="relative w-[347px] h-[66px]">
          <div
            className="absolute inset-0 border border-[#87919b]"
            style={{
              backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 347 66" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" height="100%" width="100%" fill="url(%23grad)" opacity="1"/><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(30.05 -0.7 0.38325 16.452 41.5 33)"><stop stop-color="rgba(117,183,179,1)" offset="0"/><stop stop-color="rgba(87,137,134,1)" offset="0.40416"/><stop stop-color="rgba(102,169,164,1)" offset="0.70208"/><stop stop-color="rgba(116,201,193,1)" offset="1"/></radialGradient></defs></svg>')`,
            }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-['Akshar:Medium',_sans-serif] font-medium text-white text-[26px] tracking-[3.12px] text-shadow-[rgba(0,0,0,0.3)_0px_1px_1px]">
              GENERATE SCENARIO
            </span>
          </div>
          
          {/* Corner highlights */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-white" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-white" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-white" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-white" />
        </div>
      </div>
    </SectionContainer>
  );
}

export default function App() {
  return (
    <div className="bg-[#0e0f10] relative min-h-screen" data-name="New Scenario">
      {/* Background */}
      <div
        className="fixed inset-0 bg-no-repeat"
        style={{ 
          backgroundImage: `url('${img}')`,
          backgroundSize: '103.45% 116.38%',
          backgroundPosition: '0% 46.05%'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <NavigationHeader />
        <MapSelection />
        <AgentSection title="우리 팀 요원" teamType="our" />
        <AgentSection title="상대 팀 요원" teamType="enemy" />
        <TemplateSection />
        <GenerateButton />
      </div>
    </div>
  );
}