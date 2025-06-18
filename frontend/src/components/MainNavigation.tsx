import { Panel } from './Panel';
import { getPanelItems } from '../utils/panels';
import { useNavigate } from 'react-router-dom';

export function MainNavigation() {
  const panelItems = getPanelItems();
  const navigate = useNavigate();

  const handlePanelClick = (panelId: string) => {
    if (panelId === 'new-scenario') {
      navigate('/new-scenario');
    }
    // Navigation logic for other panels can be implemented here
  };

  return (
    <nav className="panel-navigation">
      <div className="panel-navigation__container">
        {panelItems.map((panel) => (
          <Panel
            key={panel.id}
            id={panel.id}
            label={panel.label}
            isHighlighted={panel.isHighlighted}
            position={panel.position}
            onClick={() => handlePanelClick(panel.id)}
          />
        ))}
      </div>
    </nav>
  );
}