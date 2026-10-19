import { formatDuration, MIN_STARS_TO_UNLOCK } from '../game/rules';
import { useEffect } from 'react';
import { Icon, StarRow } from './Icons';
import { playSound } from '../audio/sound';

function resultTone(accuracy) {
  if (accuracy >= 80) {
    return {
      tone: 'tone-good',
      icon: '✅',
      message: 'Well prepared. You chose the safest action most of the time.',
    };
  }
  if (accuracy >= 50) {
    return {
      tone: 'tone-ok',
      icon: '⚠️',
      message: 'A solid start. Read the explanations for the ones you missed and try again.',
    };
  }
  return {
    tone: 'tone-low',
    icon: '📘',
    message: 'Worth another round. Each explanation shows what to do in a real emergency.',
  };
}

function unlockLine(passed, nextLevel) {
  const plural = MIN_STARS_TO_UNLOCK === 1 ? '' : 's';
  if (passed && nextLevel) return `🔓 ${nextLevel.label} is unlocked.`;
  if (passed) return '🏁 You have completed every level.';
  if (nextLevel) return `🔒 Earn at least ${MIN_STARS_TO_UNLOCK} star${plural} to unlock ${nextLevel.label}.`;
  return `Earn at least ${MIN_STARS_TO_UNLOCK} star${plural} to complete the final level.`;
}

export default function ResultsScreen({
  outcome,
  score,
  accuracy,
  stars, // null in Survival Mode, 0-3 for a level
  passed,
  levelLabel,
  nextLevel,
  answered,
  total,
  elapsedSeconds,
  avgSeconds,
  onRestart,
  onNext, // null when there is no next level to go to
  onLevels, // null in Survival Mode
  onMenu,
}) {
  const { tone, icon, message: toneMessage } = resultTone(accuracy);
  // Achievement badge: all 3 stars on a level, or every Survival emergency cleared.
  const earnedMedal = stars === 3 || outcome === 'cleared';

  // Result jingle once on arrival: win when the level was passed or Survival was
  // cleared, losing sound otherwise. The power-up chime follows when a medal is earned.
  useEffect(() => {
    const won = isLevel ? passed : outcome === 'cleared';
    playSound(won ? 'levelWin' : 'wrong');
    if (earnedMedal) playSound('powerUp', { delayMs: 2700 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isLevel = stars !== null;

  let heading;
  let message = toneMessage;
  if (isLevel) {
    heading = passed ? 'Level complete' : 'Level not passed';
  } else if (outcome === 'cleared') {
    heading = 'All emergencies survived';
    message = `You made it through all ${total} emergencies with Safety Points to spare.`;
  } else {
    heading = 'Safety Points depleted';
    message = `Your Safety Points ran out after ${answered} of ${total} scenarios. Read the explanations and try again.`;
  }

  return (
    <section className={`placard ${tone}`}>
      <div className="placard-head">
        <span className="glyph" aria-hidden="true">
          {earnedMedal ? <Icon name="medal" /> : icon}
        </span>
        <h2 className="placard-topic">{heading}</h2>
      </div>

      {isLevel && (
        <div className="result-rating">
          <StarRow count={stars} />
          <span className="result-level">{levelLabel}</span>
        </div>
      )}

      <div className="result-stats three">
        <div className="result-stat">
          <div className="result-value">{score}</div>
          <div className="result-label">Final score</div>
        </div>
        <div className="result-stat">
          <div className="result-value">
            {accuracy}
            <small>%</small>
          </div>
          <div className="result-label">Accuracy</div>
        </div>
        <div className="result-stat">
          <div className="result-value">{formatDuration(elapsedSeconds)}</div>
          <div className="result-label">Total time</div>
        </div>
      </div>
      <p className="result-detail">
        Answered {answered} of {total} scenarios · average {Math.round(avgSeconds)}s per scenario
      </p>

      <p className="result-message">{message}</p>
      {isLevel && <p className="result-unlock">{unlockLine(passed, nextLevel)}</p>}

      <div className="result-actions">
        {onNext && (
          <button className="btn btn-primary" onClick={onNext}>
            Next level
          </button>
        )}
        <button className={onNext ? 'btn btn-secondary' : 'btn btn-primary'} onClick={onRestart}>
          {isLevel ? 'Retry level' : 'Play Again'}
        </button>
        {onLevels && (
          <button className="btn btn-secondary" onClick={onLevels}>
            All levels
          </button>
        )}
        <button className="btn btn-secondary" onClick={onMenu}>
          Back to Menu
        </button>
      </div>
    </section>
  );
}
