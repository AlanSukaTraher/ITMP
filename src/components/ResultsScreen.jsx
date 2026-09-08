export default function ResultsScreen({ score, accuracy, onRestart, onMenu }) {
  return (
    <div className="card">
      <h2>Game Over!</h2>
      <p>Your Final Score: {score}</p>
      <p>Accuracy: {accuracy}%</p>
      <div className="options-grid">
        <button onClick={onRestart}>Play Again</button>
        <button onClick={onMenu}>Back to Menu</button>
      </div>
    </div>
  );
}