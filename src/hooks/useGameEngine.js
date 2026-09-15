import { useState, useEffect, useCallback } from 'react';

const TIMER_DEFAULT = 15;

// Shared quiz logic for all three modes:
// - Scenario Mode: fixed order, no lives, no timer, ends after the last question.
// - Timed Emergency Mode: fixed order like Scenario Mode, but each question has a
//   15s countdown. Running out of time counts as a wrong answer. Correct answers
//   score a speed bonus equal to the time remaining.
// - Survival Mode: random order (no immediate repeats), 3 lives, ends at 0 lives.
export function useGameEngine({ questions, mode }) {
  const isSurvival = mode === 'survival';
  const isTimed = mode === 'timed';

  const pickIndex = useCallback((usedIndices) => {
    const allIndices = questions.map((_, i) => i);
    const available = allIndices.filter((i) => !usedIndices.includes(i));
    const pool = available.length > 0 ? available : allIndices; // reshuffle once exhausted
    return pool[Math.floor(Math.random() * pool.length)];
  }, [questions]);

  const [questionIndex, setQuestionIndex] = useState(() => (isSurvival ? pickIndex([]) : 0));
  const [usedIndices, setUsedIndices] = useState(() => [questionIndex]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(isSurvival ? 3 : null);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [pendingGameOver, setPendingGameOver] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(isTimed ? TIMER_DEFAULT : null);

  const currentQuestion = questions[questionIndex];
  const questionNumber = answeredCount + 1;
  const isLastScenarioQuestion = !isSurvival && questionNumber >= questions.length;
  const isFinalPrompt = pendingGameOver || isLastScenarioQuestion;

  const answer = (option) => {
    setSelectedOption(option);

    if (option.isCorrect) {
      const speedBonus = isTimed ? timeLeft : 0;
      setScore((prev) => prev + 10 + speedBonus);
      setCorrectCount((prev) => prev + 1);
    } else if (isSurvival) {
      setLives((prev) => {
        const updated = prev - 1;
        if (updated <= 0) setPendingGameOver(true);
        return updated;
      });
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
      return;
    }

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
    setLives(isSurvival ? 3 : null);
    setCorrectCount(0);
    setSelectedOption(null);
    setPendingGameOver(false);
    setGameOver(false);
    setTimeLeft(isTimed ? TIMER_DEFAULT : null);
  };

  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return {
    currentQuestion,
    questionNumber,
    totalQuestions: questions.length,
    score,
    lives,
    timeLeft,
    isTimed,
    selectedOption,
    gameOver,
    isFinalPrompt,
    accuracy,
    answer,
    advance,
    restart,
  };
}