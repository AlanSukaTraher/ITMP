const MODES = [
  {
    id: 'scenario',
    icon: '📋',
    name: 'Scenario Mode',
    desc: 'Work through every scenario in order. No timer.',
  },
  {
    id: 'timed',
    icon: '⏱️',
    name: 'Timed Emergency Mode',
    desc: '15 seconds per question. Faster correct answers earn bonus points.',
  },
  {
    id: 'survival',
    icon: '❤️',
    name: 'Survival Mode',
    desc: 'Random scenarios until you lose all 3 lives.',
  },
];

export default function ModeSelect({ onSelect }) {
  return (
    <section>
      <p className="lede">
        Choose the safest action in fire, flood, storm, earthquake and first aid emergencies.
      </p>
      <h2 className="menu-heading">Choose a mode</h2>
      <div className="mode-list">
        {MODES.map((m) => (
          <button
            key={m.id}
            className="mode"
            data-mode={m.id}
            onClick={() => onSelect(m.id)}
          >
            <span className="mode-icon" aria-hidden="true">
              <span className="glyph">{m.icon}</span>
            </span>
            <span className="mode-text">
              <span className="mode-name">{m.name}</span>
              <span className="mode-desc">{m.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
