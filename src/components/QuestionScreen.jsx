export default function QuestionScreen({ engine, mode }) {
  const {
    currentQuestion,
    questionNumber,
    totalQuestions,
    score,
    lives,
    timeLeft,
    isTimed,
    selectedOption,
    isFinalPrompt,
    answer,
    advance,
  } = engine;

  if (!currentQuestion) return null;

  return (
    <div className="card">
      <div className="stats">
        <span>
          Question {questionNumber}
          {mode !== 'survival' ? ` / ${totalQuestions}` : ''}
        </span>
        <span>Score: {score}</span>
        {lives !== null && <span>Lives: {'❤️'.repeat(lives)}</span>}
        {isTimed && (
          <span className={`timer ${timeLeft <= 5 ? 'warning' : ''}`}>
            ⏱️ Time Left: {timeLeft}s
          </span>
        )}
      </div>

      <h2>{currentQuestion.scenario}</h2>

      <div className="options-grid">
        {currentQuestion.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const showResult = selectedOption !== null;
          return (
            <button
              key={idx}
              disabled={showResult}
              onClick={() => answer(opt)}
              className={showResult && isSelected ? (opt.isCorrect ? 'correct' : 'incorrect') : ''}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <div className="feedback-box">
          <p>{selectedOption.feedback}</p>
          <button onClick={advance}>{isFinalPrompt ? 'See Results' : 'Next Question'}</button>
        </div>
      )}
    </div>
  );
}