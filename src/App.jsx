import { useState, useEffect } from 'react';
import { questions } from './questions';
import { useGameEngine } from './hooks/useGameEngine';
import ModeSelect from './components/ModeSelect';
import QuestionScreen from './components/QuestionScreen';
import ResultsScreen from './components/ResultsScreen';
import './App.css';

const TIMER_DEFAULT = 15;

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(TIMER_DEFAULT);
  const [selectedFeedback, setSelectedFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const currentQ = questions[currentIndex];

  // Timer logic using useEffect
  useEffect(() => {
    // Stop timer if feedback is active or game is over
    if (selectedFeedback || gameOver) return;

    // Handle time expiration
    if (timeLeft === 0) {
      setSelectedFeedback("⏰ Time's up! You ran out of time to respond.");
      setLives((prevLives) => {
        const updatedLives = prevLives - 1;
        if (updatedLives <= 0) {
          setGameOver(true);
        }
        return updatedLives;
      });
      return;
    }

    // Countdown interval
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, selectedFeedback, gameOver]);

  const handleAnswer = (option) => {
    setSelectedFeedback(option.feedback);
    if (option.isCorrect) {
      // Bonus points for quick answers
      setScore(score + 10 + timeLeft);
    } else {
      setLives(lives - 1);
      if (lives - 1 <= 0) {
        setGameOver(true);
      }
    }
  };

  const handleNext = () => {
    setSelectedFeedback("");
    setTimeLeft(TIMER_DEFAULT);
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
    setTimeLeft(TIMER_DEFAULT);
    setSelectedFeedback("");
    setGameOver(false);
  };
  const [mode, setMode] = useState(null); // null | 'scenario' | 'survival'

  return (
    <div className="game-container">
      <h1>Emergency Response Simulator</h1>
      {mode === null ? (
        <ModeSelect onSelect={setMode} />
      ) : (
<<<<<<< HEAD
        <div className="card">
          <div className="stats">
            <span>Score: {score}</span>
            <span className={`timer ${timeLeft <= 5 ? 'warning' : ''}`}>
              ⏱️ Time Left: {timeLeft}s
            </span>
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
=======
        <GameRunner mode={mode} onExit={() => setMode(null)} />
>>>>>>> feature/timer-logic
      )}
    </div>
  );
}

function GameRunner({ mode, onExit }) {
  const engine = useGameEngine({ questions, mode });

  if (engine.gameOver) {
    return (
      <ResultsScreen
        score={engine.score}
        accuracy={engine.accuracy}
        onRestart={engine.restart}
        onMenu={onExit}
      />
    );
  }

  return <QuestionScreen engine={engine} mode={mode} />;
}