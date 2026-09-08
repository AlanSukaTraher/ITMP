export default function ModeSelect({ onSelect }) {
  return (
    <div className="card">
      <h2>Choose a Mode</h2>
      <div className="options-grid">
        <button onClick={() => onSelect('scenario')}>Scenario Mode</button>
        <button onClick={() => onSelect('survival')}>Survival Mode</button>
      </div>
    </div>
  );
}