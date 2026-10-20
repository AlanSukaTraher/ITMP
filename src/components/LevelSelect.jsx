import { isUnlocked, MIN_STARS_TO_UNLOCK } from '../game/rules';
import { LEVEL_IDS } from '../game/levels';
import { Icon, StarRow } from './Icons';

export default function LevelSelect({ mode, levels, progress, best = {}, onSelect, onBack, onReset }) {
  const plural = MIN_STARS_TO_UNLOCK === 1 ? '' : 's';
  const lede =
    mode === 'timed'
      ? `Every scenario has a 15 second countdown. Earn at least ${MIN_STARS_TO_UNLOCK} star${plural} on a level to unlock the next.`
      : `Play each emergency as a level. Earn at least ${MIN_STARS_TO_UNLOCK} star${plural} on a level to unlock the next.`;

  const handleReset = () => {
    if (window.confirm('Reset all stars and lock the levels again?')) onReset();
  };

  return (
    <section>
      <p className="lede">{lede}</p>
      <h2 className="menu-heading">Choose a level</h2>
      <div className="mode-list">
        {levels.map((level, index) => {
          const unlocked = isUnlocked(level.id, progress, LEVEL_IDS);
          const stars = progress[level.id] ?? 0;
          const previous = levels[index - 1];
          return (
            <button
              key={level.id}
              className="mode level"
              data-topic={level.id}
              disabled={!unlocked}
              onClick={() => onSelect(level.id)}
            >
              <span className="mode-icon" aria-hidden="true">
                <span className="glyph">
                  {unlocked ? <Icon name={level.icon} /> : '🔒'}
                </span>
              </span>
              <span className="mode-text">
                <span className="mode-name">{level.label}</span>
                <span className="mode-desc">
                  {unlocked
                    ? `${level.scenarios.length} scenarios${
                        best[`${mode}:${level.id}`] ? ` · Best score ${best[`${mode}:${level.id}`].score}` : ''
                      }`
                    : `Locked. Earn ${MIN_STARS_TO_UNLOCK} star${plural} on ${previous.label} first.`}
                </span>
              </span>
              {unlocked && <StarRow count={stars} className="level-stars" />}
            </button>
          );
        })}
      </div>
      <div className="level-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back to Menu
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset progress
        </button>
      </div>
    </section>
  );
}
