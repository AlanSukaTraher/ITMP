import { useEffect, useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { useProgress } from './hooks/useProgress';
import { useBest } from './hooks/useBest';
import { LEVELS, TIMED_LEVELS, ALL_SCENARIOS } from './game/levels';
import { starsFor, MIN_STARS_TO_UNLOCK } from './game/rules';
import ModeSelect from './components/ModeSelect';
import LevelSelect from './components/LevelSelect';
import QuestionScreen from './components/QuestionScreen';
import ResultsScreen from './components/ResultsScreen';
import SoundToggle from './components/SoundToggle';
import { playSound, setMusicWanted } from './audio/sound';
import './App.css';

// Fisher-Yates shuffle, returning a new array.
function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  const [mode, setMode] = useState(null); // null | 'scenario' | 'timed' | 'survival'
  const [levelId, setLevelId] = useState(null); // null while choosing a level
  const { progress, recordResult, resetProgress } = useProgress();
  const { best, recordBest, resetBest } = useBest();

  // Scenario and Timed Emergency modes are played level by level.
  // Survival Mode plays all scenarios in a random order.
  const usesLevels = mode === 'scenario' || mode === 'timed';
  const levels = mode === 'timed' ? TIMED_LEVELS : LEVELS;
  const level = levels.find((l) => l.id === levelId) ?? null;
  const inGame = mode === 'survival' || (usesLevels && level !== null);

  const chooseMode = (next) => {
    setMode(next);
    setLevelId(null);
  };
  const backToMenu = () => chooseMode(null);

  // Lobby music plays on the menu and level screens, and stops during a game.
  useEffect(() => {
    setMusicWanted(!inGame);
  }, [inGame]);

  // One click sound for every button. Answer buttons have their own sounds.
  useEffect(() => {
    const onClick = (event) => {
      const button = event.target.closest?.('button');
      if (!button || button.disabled) return;
      if (button.classList.contains('option') || button.classList.contains('sound-toggle')) return;
      playSound('click');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className={`game-container${inGame ? ' in-game' : ''}`}>
      <SoundToggle />
      <h1>Disaster Ready</h1>
      {mode === null && <ModeSelect onSelect={chooseMode} />}
      {usesLevels && level === null && (
        <LevelSelect
          mode={mode}
          levels={levels}
          progress={progress}
          best={best}
          onSelect={setLevelId}
          onBack={backToMenu}
          onReset={() => {
            resetProgress();
            resetBest();
          }}
        />
      )}
      {inGame && (
        <GameRunner
          key={`${mode}:${levelId ?? 'all'}`}
          mode={mode}
          level={level}
          levels={levels}
          onRecord={recordResult}
          onBest={recordBest}
          onSelectLevel={setLevelId}
          onLevels={() => setLevelId(null)}
          onMenu={backToMenu}
        />
      )}
    </div>
  );
}

function GameRunner({ mode, level, levels, onRecord, onBest, onSelectLevel, onLevels, onMenu }) {
  // Scenarios are shuffled once per play, so replays are not identical.
  const [questions] = useState(() => shuffled(level ? level.scenarios : ALL_SCENARIOS));
  const [bestInfo, setBestInfo] = useState(null);

  // Called once when the last result is reached: save the star rating for levels.
  const handleFinish = (result) => {
    if (level) onRecord(level.id, starsFor(result.correct, result.total));
    setBestInfo(onBest(`${mode}:${level?.id ?? 'all'}`, result.score, result.elapsedMs / 1000));
  };

  const engine = useGameEngine({ questions, mode, onFinish: handleFinish });

  if (engine.gameOver) {
    const stars = level ? starsFor(engine.correctCount, engine.answeredCount) : null;
    const passed = stars !== null && stars >= MIN_STARS_TO_UNLOCK;
    const nextLevel = level ? (levels[levels.findIndex((l) => l.id === level.id) + 1] ?? null) : null;

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
        history={engine.history}
        bestInfo={bestInfo}
        onRestart={engine.restart}
        onNext={passed && nextLevel ? () => onSelectLevel(nextLevel.id) : null}
        onLevels={level ? onLevels : null}
        onMenu={onMenu}
      />
    );
  }

  return <QuestionScreen engine={engine} />;
}
