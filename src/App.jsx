import { useState } from 'react';
import { questions } from './questions';
import './App.css';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedFeedback, setSelectedFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const currentQ = questions[currentIndex];

  const handleAnswer = (option) => {
    setSelectedFeedback(option.feedback);
    if (option.isCorrect) {
      setScore(score + 10);
    } else {
      setLives(lives - 1);
      if (lives - 1 <= 0) {
        setGameOver(true);
      }
    }
  };

  const handleNext = () => {
    setSelectedFeedback("");
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setLives(3);
    setSelectedFeedback("");
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <h1>Emergency Response Simulator</h1>
      
      {gameOver ? (
        <div className="card">
          <h2>Game Over!</h2>
          <p>Your Final Score: {score}</p>
          <button onClick={restartGame}>Play Again</button>
        </div>
      ) : (
        <div className="card">
          <div className="stats">
            <span>Score: {score}</span>
            <span>Lives: {"❤️".repeat(lives)}</span>
          </div>

          <h2>{currentQ.scenario}</h2>

          <div className="options-grid">
            {currentQ.options.map((opt, idx) => (
              <button 
                key={idx} 
                disabled={selectedFeedback !== ""} 
                onClick={() => handleAnswer(opt)}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {selectedFeedback && (
            <div className="feedback-box">
              <p>{selectedFeedback}</p>
              <button onClick={handleNext}>Next Question</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}