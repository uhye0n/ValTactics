const popularScenarios = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
];

export function PopularScenarios() {
  return (
    <section className="popular-scenarios">
      <div className="popular-scenarios__container">
        <div className="popular-scenarios__grid">
          {popularScenarios.map((scenario) => (
            <div key={scenario.id} className="scenario-card">
              <div className="scenario-card__content"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}