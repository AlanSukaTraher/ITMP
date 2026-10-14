import { useEffect, useRef } from 'react';
import { TOPIC_ICONS } from '../game/levels';

const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];

function safetyTone(points, max) {
  const share = points / max;
  if (share <= 0.3) return 'is-danger';
  if (share <= 0.5) return 'is-caution';
  return 'is-safe';
}

export default function QuestionScreen({ engine }) {
  const {
    currentQuestion,
    questionNumber,
    totalQuestions,
    score,
    safety,
    safetyMax,
    lastImpact,
    timeLeft,
    timerMax = 15,
    isTimed,
    selectedOption,
    isFinalPrompt,
    answer,
    advance,
  } = engine;

  const feedbackRef = useRef(null);

  // Bring the feedback box into view after answering (matters on phones).
  useEffect(() => {
    if (selectedOption) feedbackRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selectedOption]);

  if (!currentQuestion) return null;

  const answered = selectedOption !== null;
  const timerPercent = isTimed ? Math.max(0, Math.min(100, (timeLeft / timerMax) * 100)) : 0;
  const hasSafety = safety !== null;

  return (
    <div>
      <div className="status">
        <span>
          Question <strong>{questionNumber}</strong>
          <span className="of"> / {totalQuestions}</span>
        </span>
        <span>
          Score <strong>{score}</strong>
        </span>
      </div>

      {hasSafety && (
        <div
          className={`safety ${safetyTone(safety, safetyMax)}`}
          role="meter"
          aria-label="Safety Points"
          aria-valuemin={0}
          aria-valuemax={safetyMax}
          aria-valuenow={safety}
        >
          <span className="safety-label">Safety Points</span>
          <div className="safety-track" style={{ '--segments': safetyMax }}>
            <div className="safety-fill" style={{ width: `${(safety / safetyMax) * 100}%` }} />
          </div>
          <span className="safety-num">
            {safety}
            <span className="safety-max">/{safetyMax}</span>
          </span>
        </div>
      )}

      {isTimed && (
        <div className={`timer ${timeLeft <= 5 ? 'warning' : ''}`} role="timer">
          <div className="timer-track">
            <div className="timer-fill" style={{ width: `${timerPercent}%` }} />
          </div>
          <span className="timer-num">
            {timeLeft}
            <span className="sr-only"> seconds left</span>
            <span aria-hidden="true">s</span>
          </span>
        </div>
      )}

      <section className="placard" data-topic={currentQuestion.topic}>
        <div className="placard-head">
          <span className="glyph" aria-hidden="true">
            {TOPIC_ICONS[currentQuestion.topic] ?? '⚠️'}
          </span>
          <span className="placard-topic">{currentQuestion.topicLabel}</span>
        </div>
        <div className="placard-body">
          <h2 className="scenario-title">{currentQuestion.title}</h2>
          <p className="scenario-text">{currentQuestion.scenario}</p>
        </div>
      </section>

      <div className="options">
        {currentQuestion.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          let state = '';
          if (answered) state = opt.isCorrect ? 'correct' : isSelected ? 'incorrect' : 'dim';
          return (
            <button
              key={idx}
              className={`option ${state}`}
              disabled={answered}
              onClick={() => answer(opt)}
            >
              <span className="option-key" aria-hidden="true">
                {OPTION_KEYS[idx]}
              </span>
              <span>{opt.text}</span>
              {state === 'correct' && <span className="option-mark">✓ Correct answer</span>}
              {state === 'incorrect' && <span className="option-mark">✗ Your answer</span>}
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <div
          ref={feedbackRef}
          role="status"
          className={`feedback ${selectedOption.isCorrect ? 'is-correct' : 'is-incorrect'}`}
        >
          {hasSafety && lastImpact !== null && (
            <p className={`impact ${lastImpact > 0 ? 'impact-up' : 'impact-down'}`}>
              Safety Points {lastImpact > 0 ? '+' : '−'}
              {Math.abs(lastImpact)}
            </p>
          )}
          <p>{selectedOption.feedback}</p>
          <button className="btn btn-primary" onClick={advance}>
            {isFinalPrompt ? 'See Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
}
