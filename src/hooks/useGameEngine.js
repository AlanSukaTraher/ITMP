import { useState, useEffect, useCallback, useRef } from 'react';
import {
  SAFETY_START,
  SAFETY_MAX,
  TIMEOUT_IMPACT,
  applySafety,
  impactOf,
} from '../game/rules';

const TIMER_DEFAULT = 15;

// Shared quiz logic for all three modes. `questions` is the list to play:
// - Scenario Mode: one level (a topic's scenarios) in fixed order, no timer.
// - Timed Emergency Mode: same as Scenario Mode, but each question has a 15s
//   countdown. Running out of time counts as a wrong answer. Correct answers
//   score a speed bonus equal to the time remaining.
// - Survival Mode: all scenarios in random order. Each choice changes the
//   Safety Points pool (wrong = lose points, correct = restore points). The run
//   ends when the pool hits zero, or when every scenario has been survived.
//
// All modes record how long the player spent answering, so the results screen
// can show a timing summary. `onFinish` is called once, when the player leaves
// the last feedback screen, with the final numbers (used to save level progress).
export function useGameEngine({ questions, mode, onFinish }) {
  const isSurvival = mode === 'survival';
  const isTimed = mode === 'timed';

  const pickIndex = useCallback((usedIndices) => {
    const allIndices = questions.map((_, i) => i);
    const available = allIndices.filter((i) => !usedIndices.includes(i));
    const pool = available.length > 0 ? available : allIndices;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [questions]);

  const [questionIndex, setQuestionIndex] = useState(() => (isSurvival ? pickIndex([]) : 0));
  const [usedIndices, setUsedIndices] = useState(() => [questionIndex]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [score, setScore] = useState(0);
  const [safety, setSafety] = useState(isSurvival ? SAFETY_START : null);
  const [lastImpact, setLastImpact] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [pendingGameOver, setPendingGameOver] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(isTimed ? TIMER_DEFAULT : null);
  const [elapsedMs, setElapsedMs] = useState(0);
  // Every answer given, so the results screen can review the mistakes.
  const [history, setHistory] = useState([]);

  // When the current question was shown; only time spent answering counts
  // (reading the feedback does not).
  const questionStartRef = useRef(0);
  useEffect(() => {
    questionStartRef.current = Date.now();
  }, []);

  const currentQuestion = questions[questionIndex];
  const questionNumber = answeredCount + 1;
  const isLastQuestion = questionNumber >= questions.length;
  const isFinalPrompt = pendingGameOver || isLastQuestion;
  // 'depleted' = Survival ran out of Safety Points, 'cleared' = Survival finished
  // every scenario, 'complete' = a level was finished.
  const outcome = pendingGameOver ? 'depleted' : isSurvival ? 'cleared' : 'complete';

  const answer = (option) => {
    setSelectedOption(option);
    setElapsedMs((prev) => prev + (Date.now() - questionStartRef.current));
    const right = currentQuestion.options.find((o) => o.isCorrect);
    setHistory((prev) => [
      ...prev,
      {
        id: currentQuestion.id,
        title: currentQuestion.title,
        topicLabel: currentQuestion.topicLabel,
        correct: option.isCorrect,
        timedOut: option.text === null,
        chosenText: option.text,
        correctText: right?.text ?? '',
        explanation: (right?.feedback ?? '').replace(/^Correct[.!]\s*/, ''),
      },
    ]);

    if (option.isCorrect) {
      const speedBonus = isTimed ? timeLeft : 0;
      setScore((prev) => prev + 10 + speedBonus);
      setCorrectCount((prev) => prev + 1);
    }

    if (isSurvival) {
      const impact = impactOf(option);
      const updated = applySafety(safety, impact);
      setLastImpact(impact);
      setSafety(updated);
      if (updated <= 0) setPendingGameOver(true);
    }
  };

  // Countdown for Timed Emergency Mode. Stops while feedback is showing or
  // the game has ended; running it out submits an automatic wrong answer.
  useEffect(() => {
    if (!isTimed) return;
    if (selectedOption || gameOver) return;

    if (timeLeft === 0) {
      const timeout = setTimeout(() => {
        answer({
          text: null,
          isCorrect: false,
          safetyImpact: TIMEOUT_IMPACT,
          feedback: "⏰ Time's up! You ran out of time to respond.",
        });
      }, 0);
      return () => clearTimeout(timeout);
    }

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, selectedOption, gameOver, isTimed]);

  // Game-over is only applied here, after the feedback for the
  // final/fatal answer has already been shown and the player clicks on.
  const advance = () => {
    setSelectedOption(null);
    setAnsweredCount((prev) => prev + 1);
    if (isTimed) setTimeLeft(TIMER_DEFAULT);

    if (isFinalPrompt) {
      setGameOver(true);
      onFinish?.({
        mode,
        outcome,
        correct: correctCount,
        total: answeredCount + 1,
        score,
        elapsedMs,
        safety,
      });
      return;
    }

    questionStartRef.current = Date.now();

    if (isSurvival) {
      const next = pickIndex(usedIndices);
      setUsedIndices((prev) => [...prev, next]);
      setQuestionIndex(next);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const restart = () => {
    const first = isSurvival ? pickIndex([]) : 0;
    setQuestionIndex(first);
    setUsedIndices([first]);
    setAnsweredCount(0);
    setScore(0);
    setSafety(isSurvival ? SAFETY_START : null);
    setLastImpact(null);
    setCorrectCount(0);
    setSelectedOption(null);
    setPendingGameOver(false);
    setGameOver(false);
    setTimeLeft(isTimed ? TIMER_DEFAULT : null);
    setElapsedMs(0);
    setHistory([]);
    questionStartRef.current = Date.now();
  };

  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const elapsedSeconds = elapsedMs / 1000;
  const avgSeconds = answeredCount > 0 ? elapsedSeconds / answeredCount : 0;

  return {
    currentQuestion,
    questionNumber,
    totalQuestions: questions.length,
    score,
    safety,
    safetyMax: SAFETY_MAX,
    lastImpact,
    timeLeft,
    timerMax: TIMER_DEFAULT,
    isTimed,
    selectedOption,
    gameOver,
    isFinalPrompt,
    outcome,
    correctCount,
    answeredCount,
    accuracy,
    elapsedSeconds,
    avgSeconds,
    history,
    answer,
    advance,
    restart,
  };
}
