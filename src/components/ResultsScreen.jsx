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

export default function ResultsScreen({ score, accuracy, mode, onRestart, onMenu }) {
  const { tone, icon, message } = resultTone(accuracy);
  const heading = mode === 'survival' ? 'Out of lives' : 'Round complete';

  return (
    <section className={`placard ${tone}`}>
      <div className="placard-head">
        <span className="glyph" aria-hidden="true">
          {icon}
        </span>
        <h2 className="placard-topic">{heading}</h2>
      </div>
      <div className="result-stats">
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
      </div>
      <p className="result-message">{message}</p>
      <div className="result-actions">
        <button className="btn btn-primary" onClick={onRestart}>
          Play Again
        </button>
        <button className="btn btn-secondary" onClick={onMenu}>
          Back to Menu
        </button>
      </div>
    </section>
  );
}
