import { Panel } from './Panel';
import { getPanelItems } from '../utils/panels';

export function MainNavigation() {
  const panelItems = getPanelItems();

  const handlePanelClick = (panelId: string) => {
    // Navigation logic will be implemented here
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