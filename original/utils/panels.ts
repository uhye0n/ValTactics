interface PanelPosition {
  top: string;
  left?: string;
}

export interface PanelItem {
  id: string;
  label: string;
  isHighlighted?: boolean;
  position: PanelPosition;
}

export function getPanelItems(): PanelItem[] {
  return [
    {
      id: 'new-scenario',
      label: '새 시나리오',
      isHighlighted: true,
      position: { top: '30%' }
    },
    {
      id: 'my-scenarios',
      label: '내 시나리오',
      position: { top: '40%' }
    },
    {
      id: 'community',
      label: '커뮤니티',
      position: { top: '50%' }
    },
    {
      id: 'guide',
      label: '가이드',
      position: { top: '60%' }
    },
    {
      id: 'settings',
      label: '설정',
      position: { top: '70%' }
    }
  ];
}