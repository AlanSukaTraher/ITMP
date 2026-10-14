import { useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { useProgress } from './hooks/useProgress';
import { LEVELS, ALL_SCENARIOS } from './game/levels';
import { starsFor, MIN_STARS_TO_UNLOCK } from './game/rules';
import ModeSelect from './components/ModeSelect';
import LevelSelect from './components/LevelSelect';
import QuestionScreen from './components/QuestionScreen';
import ResultsScreen from './components/ResultsScreen';
import './App.css';

export default function App() {
  const [mode, setMode] = useState(null); // null | 'scenario' | 'timed' | 'survival'
  const [levelId, setLevelId] = useState(null); // null while choosing a level
  const { progress, recordResult, resetProgress } = useProgress();

  // Scenario and Timed Emergency modes are played level by level.
  // Survival Mode plays all scenarios in a random order.
  const usesLevels = mode === 'scenario' || mode === 'timed';
  const level = LEVELS.find((l) => l.id === levelId) ?? null;
  const inGame = mode === 'survival' || (usesLevels && level !== null);

  const chooseMode = (next) => {
    setMode(next);
    setLevelId(null);
  };
  const backToMenu = () => chooseMode(null);

  return (
    <div className={`game-container${inGame ? ' in-game' : ''}`}>
      <h1>Emergency Response Simulator</h1>
      {mode === null && <ModeSelect onSelect={chooseMode} />}
      {usesLevels && level === null && (
        <LevelSelect
          mode={mode}
          levels={LEVELS}
          progress={progress}
          onSelect={setLevelId}
          onBack={backToMenu}
          onReset={resetProgress}
        />
      )}
      {inGame && (
        <GameRunner
          key={`${mode}:${levelId ?? 'all'}`}
          mode={mode}
          level={level}
          onRecord={recordResult}
          onSelectLevel={setLevelId}
          onLevels={() => setLevelId(null)}
          onMenu={backToMenu}
        />
      )}
    </div>
  );
}

function GameRunner({ mode, level, onRecord, onSelectLevel, onLevels, onMenu }) {
  const questions = level ? level.scenarios : ALL_SCENARIOS;

  // Called once when the last result is reached: save the star rating for levels.
  const handleFinish = (result) => {
    if (level) onRecord(level.id, starsFor(result.correct, result.total));
  };

  const engine = useGameEngine({ questions, mode, onFinish: handleFinish });

  if (engine.gameOver) {
    const stars = level ? starsFor(engine.correctCount, engine.answeredCount) : null;
    const passed = stars !== null && stars >= MIN_STARS_TO_UNLOCK;
    const nextLevel = level ? (LEVELS[LEVELS.findIndex((l) => l.id === level.id) + 1] ?? null) : null;

    return (
      <ResultsScreen
        outcome={engine.outcome}
        score={engine.score}
        accuracy={engine.accuracy}
        stars={stars}
        passed={passed}
        levelLabel={level?.label}
        nextLevel={nextLevel}
        answered={engine.answeredCount}
        total={engine.totalQuestions}
        elapsedSeconds={engine.elapsedSeconds}
        avgSeconds={engine.avgSeconds}
        onRestart={engine.restart}
        onNext={passed && nextLevel ? () => onSelectLevel(nextLevel.id) : null}
        onLevels={level ? onLevels : null}
        onMenu={onMenu}
      />
    );
  }

  return <QuestionScreen engine={engine} />;
}
