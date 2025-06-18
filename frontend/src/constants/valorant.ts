import type { MapData, Skill } from '../types/scenario';

export const VALORANT_MAPS: MapData[] = [
  {
    id: 'abyss',
    name: 'Abyss',
    imageUrl: '/resources/images/map/Abyss_map.webp',
    viewImageUrl: '/resources/images/view/Abyss.webp',
    dimensions: { width: 1024, height: 1024 },
    callouts: []
  },
  {
    id: 'ascent',
    name: 'Ascent',
    imageUrl: '/resources/images/map/Ascent_map.webp',
    viewImageUrl: '/resources/images/view/Ascent.webp',
    dimensions: { width: 1024, height: 1024 },
    callouts: []
  },
  {
    id: 'bind',
    name: 'Bind',
    imageUrl: '/resources/images/map/Bind_map.webp',
    viewImageUrl: '/resources/images/view/Bind.webp',
    dimensions: { width: 1024, height: 1024 },
    callouts: []
  },
  {
    id: 'breeze',
    name: 'Breeze',
    imageUrl: '/resources/images/map/Breeze_map.webp',
    viewImageUrl: '/resources/images/view/Breeze.webp',
    dimensions: { width: 1024, height: 1024 },
    callouts: []
  },  {
    id: 'fracture',
    name: 'Fracture',
    imageUrl: '/resources/images/map/Fracture_map.webp',
    viewImageUrl: '/resources/images/view/Fracture.webp',
    dimensions: { width: 1024, height: 1024 },
    callouts: []
  },
  {
    id: 'haven',
    name: 'Haven',
    imageUrl: '/resources/images/map/Haven_map.webp',
    viewImageUrl: '/resources/images/view/Haven.webp',
    dimensions: { width: 1024, height: 1024 },
    callouts: []
  },
  {
    id: 'icebox',
    name: 'Icebox',
    imageUrl: '/resources/images/map/Icebox_map.webp',
    viewImageUrl: '/resources/images/view/Icebox.webp',
    dimensions: { width: 1024, height: 1024 },
    callouts: []
  },
  {
    id: 'lotus',
    name: 'Lotus',
    imageUrl: '/resources/images/map/Lotus_map.webp',
    viewImageUrl: '/resources/images/view/Lotus.webp',
    dimensions: { width: 1024, height: 1024 },
    callouts: []
  },
  {
    id: 'pearl',
    name: 'Pearl',
    imageUrl: '/resources/images/map/Pearl_map.webp',
    viewImageUrl: '/resources/images/view/Pearl.webp',
    dimensions: { width: 1024, height: 1024 },
    callouts: []
  },
  {
    id: 'split',
    name: 'Split',
    imageUrl: '/resources/images/map/Split_map.webp',
    viewImageUrl: '/resources/images/view/Split.webp',
    dimensions: { width: 1024, height: 1024 },
    callouts: []
  },
  {
    id: 'sunset',
    name: 'Sunset',
    imageUrl: '/resources/images/map/Sunset_map.webp',
    viewImageUrl: '/resources/images/view/Sunset.webp',
    dimensions: { width: 1024, height: 1024 },
    callouts: []
  }
];

export const VALORANT_AGENTS = [
  'Brimstone', 'Viper', 'Omen', 'Killjoy', 'Cypher', 'Sova', 'Sage', 'Phoenix',
  'Jett', 'Reyna', 'Raze', 'Breach', 'Skye', 'Yoru', 'Astra', 'KAY/O',
  'Chamber', 'Neon', 'Fade', 'Harbor', 'Gekko', 'Deadlock', 'Iso', 'Clove'
] as const;

export type ValorantAgent = typeof VALORANT_AGENTS[number];

export const AGENT_SKILLS: Record<ValorantAgent, Skill[]> = {
  'Jett': [
    { id: 'jett-cloudburst', name: 'Cloudburst', agent: 'Jett', type: 'basic', icon: '/icons/jett-cloudburst.png' },
    { id: 'jett-updraft', name: 'Updraft', agent: 'Jett', type: 'basic', icon: '/icons/jett-updraft.png' },
    { id: 'jett-tailwind', name: 'Tailwind', agent: 'Jett', type: 'signature', icon: '/icons/jett-tailwind.png' },
    { id: 'jett-bladestorm', name: 'Blade Storm', agent: 'Jett', type: 'ultimate', icon: '/icons/jett-bladestorm.png' }
  ],
  'Phoenix': [
    { id: 'phoenix-blaze', name: 'Blaze', agent: 'Phoenix', type: 'basic', icon: '/icons/phoenix-blaze.png' },
    { id: 'phoenix-curveball', name: 'Curveball', agent: 'Phoenix', type: 'basic', icon: '/icons/phoenix-curveball.png' },
    { id: 'phoenix-hothand', name: 'Hot Hands', agent: 'Phoenix', type: 'signature', icon: '/icons/phoenix-hothand.png' },
    { id: 'phoenix-runback', name: 'Run it Back', agent: 'Phoenix', type: 'ultimate', icon: '/icons/phoenix-runback.png' }
  ],
  'Sage': [
    { id: 'sage-barrier', name: 'Barrier Orb', agent: 'Sage', type: 'basic', icon: '/icons/sage-barrier.png' },
    { id: 'sage-sloworb', name: 'Slow Orb', agent: 'Sage', type: 'basic', icon: '/icons/sage-sloworb.png' },
    { id: 'sage-healingorb', name: 'Healing Orb', agent: 'Sage', type: 'signature', icon: '/icons/sage-healingorb.png' },
    { id: 'sage-resurrection', name: 'Resurrection', agent: 'Sage', type: 'ultimate', icon: '/icons/sage-resurrection.png' }
  ],
  'Sova': [
    { id: 'sova-owl', name: 'Owl Drone', agent: 'Sova', type: 'basic', icon: '/icons/sova-owl.png' },
    { id: 'sova-shock', name: 'Shock Bolt', agent: 'Sova', type: 'basic', icon: '/icons/sova-shock.png' },
    { id: 'sova-recon', name: 'Recon Bolt', agent: 'Sova', type: 'signature', icon: '/icons/sova-recon.png' },
    { id: 'sova-hunter', name: "Hunter's Fury", agent: 'Sova', type: 'ultimate', icon: '/icons/sova-hunter.png' }
  ],
  // 다른 에이전트들도 필요시 추가...
  'Brimstone': [],
  'Viper': [],
  'Omen': [],
  'Killjoy': [],
  'Cypher': [],
  'Reyna': [],
  'Raze': [],
  'Breach': [],
  'Skye': [],
  'Yoru': [],
  'Astra': [],
  'KAY/O': [],
  'Chamber': [],
  'Neon': [],
  'Fade': [],
  'Harbor': [],
  'Gekko': [],
  'Deadlock': [],
  'Iso': [],
  'Clove': []
};

export const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0] as const;

export const PLAYER_COLORS = [
  '#FF6B6B', // 빨강
  '#4ECDC4', // 청록
  '#45B7D1', // 파랑
  '#96CEB4', // 초록
  '#FFEAA7', // 노랑
  '#DDA0DD', // 보라
  '#FFB347', // 주황
  '#98D8C8', // 민트
  '#F7DC6F', // 연노랑
  '#BB8FCE'  // 연보라
] as const;
