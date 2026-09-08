export default function QuestionScreen({ engine, mode }) {
  const {
    currentQuestion,
    questionNumber,
    totalQuestions,
    score,
    lives,
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
          {mode === 'scenario' ? ` / ${totalQuestions}` : ''}
        </span>
        <span>Score: {score}</span>
        {lives !== null && <span>Lives: {'❤️'.repeat(lives)}</span>}
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