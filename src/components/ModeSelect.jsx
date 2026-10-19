import { Icon } from './Icons';

const MODES = [
  {
    id: 'scenario',
    icon: 'scenario',
    name: 'Scenario Mode',
    desc: 'Play each emergency as a level. Earn stars to unlock the next one.',
  },
  {
    id: 'timed',
    icon: 'timed',
    name: 'Timed Emergency Mode',
    desc: 'Same levels with a 15 second countdown. Faster correct answers earn bonus points.',
  },
  {
    id: 'survival',
    icon: 'survival',
    name: 'Survival Mode',
    desc: 'Random scenarios. Wrong choices drain your Safety Points, correct ones restore them.',
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
              <span className="glyph">
                <Icon name={m.icon} />
              </span>
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
