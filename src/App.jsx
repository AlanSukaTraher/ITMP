import { useState } from 'react';
import { scenarios as questions } from './data/scenarios';
import { useGameEngine } from './hooks/useGameEngine';
import ModeSelect from './components/ModeSelect';
import QuestionScreen from './components/QuestionScreen';
import ResultsScreen from './components/ResultsScreen';
import './App.css';

export default function App() {
  const [mode, setMode] = useState(null); // null | 'scenario' | 'timed' | 'survival'

  return (
    <div className="game-container">
      <h1>Emergency Response Simulator</h1>
      {mode === null ? (
        <ModeSelect onSelect={setMode} />
      ) : (
        <GameRunner mode={mode} onExit={() => setMode(null)} />
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