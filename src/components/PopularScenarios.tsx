import { useScenario } from '../contexts/ScenarioContext';
import { useNavigate } from 'react-router-dom';

export function PopularScenarios() {
  const { scenarios, isLoading, loadScenario } = useScenario();
  const navigate = useNavigate();

  const handleScenarioClick = async (scenarioId: string) => {
    try {
      await loadScenario(scenarioId);
      navigate(`/editor/${scenarioId}`);
    } catch (error) {
      console.error('Failed to load scenario:', error);
      alert('시나리오를 불러오는데 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <section className="popular-scenarios">
        <div className="popular-scenarios__container">
          <h2 className="popular-scenarios__title">인기 시나리오</h2>
          <div className="popular-scenarios__loading">로딩 중...</div>
        </div>
      </section>
    );
  }

  // 공개 시나리오 중 최신순으로 6개 표시
  const publicScenarios = scenarios
    .filter(scenario => scenario.isPublic)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <section className="popular-scenarios">
      <div className="popular-scenarios__container">
        <h2 className="popular-scenarios__title">인기 시나리오</h2>
        <div className="popular-scenarios__grid">
          {publicScenarios.length > 0 ? (
            publicScenarios.map((scenario) => (
              <div 
                key={scenario.id} 
                className="scenario-card"
                onClick={() => handleScenarioClick(scenario.id)}
              >
                <div className="scenario-card__content">
                  <h3 className="scenario-card__title">{scenario.title}</h3>
                  <p className="scenario-card__map">{scenario.mapName}</p>
                  <p className="scenario-card__author">by {scenario.author?.username || 'Anonymous'}</p>
                  {scenario.description && (
                    <p className="scenario-card__description">{scenario.description}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="scenario-card scenario-card--empty">
              <div className="scenario-card__content">
                <p>아직 공개된 시나리오가 없습니다.</p>
                <p>첫 번째 시나리오를 만들어보세요!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}