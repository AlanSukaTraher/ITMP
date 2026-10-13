import { useEffect, useRef } from 'react';

const TOPIC_ICONS = {
  fire: '🔥',
  flood: '🌊',
  storm: '🌪️',
  earthquake: '🏚️',
  first_aid: '🩹',
};
const MAX_LIVES = 3;
const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuestionScreen({ engine, mode }) {
  const {
    currentQuestion,
    questionNumber,
    totalQuestions,
    score,
    lives,
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

  return (
    <div>
      <div className="status">
        <span>
          Question <strong>{questionNumber}</strong>
          {mode !== 'survival' && <span className="of"> / {totalQuestions}</span>}
        </span>
        <span>
          Score <strong>{score}</strong>
        </span>
        {lives !== null && (
          <span>
            <span className="sr-only">
              {lives} of {MAX_LIVES} lives left
            </span>
            Lives
            <span className="hearts" aria-hidden="true">
              {Array.from({ length: MAX_LIVES }, (_, i) => (
                <span key={i} className={i < lives ? '' : 'heart-lost'}>
                  {i < lives ? '❤️' : '🖤'}
                </span>
              ))}
            </span>
          </span>
        )}
      </div>

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
          <p>{selectedOption.feedback}</p>
          <button className="btn btn-primary" onClick={advance}>
            {isFinalPrompt ? 'See Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
}
