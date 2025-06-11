interface PanelPosition {
  top: string;
  left?: string;
}

interface PanelProps {
  id: string;
  label: string;
  isHighlighted?: boolean;
  position: PanelPosition;
  onClick?: () => void;
}

export function Panel({ id, label, isHighlighted = false, position, onClick }: PanelProps) {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <div 
      className="panel-item"
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left || 'calc(12.5vw - 55px)', // 현재 위치의 절반만큼 더 왼쪽
        transform: 'translateY(-50%)',
      }}
      data-panel-id={id}
      data-highlighted={isHighlighted}
    >
      <div className="panel-item__indicator" />
      <button 
        className={`panel-item__button ${isHighlighted ? 'panel-item__button--highlighted' : ''}`}
        onClick={handleClick}
        type="button"
      >
        {label}
      </button>
    </div>
  );
}