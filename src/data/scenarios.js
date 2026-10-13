import fire from './fire.json';
import flood from './flood.json';
import storm from './storm.json';
import earthquake from './earthquake.json';
import firstAid from './first_aid.json';

const topics = [fire, flood, storm, earthquake, firstAid];

// Randomly reorders an array without mutating the original (Fisher-Yates shuffle).
// This removes any fixed pattern in where the correct answer sits, so players
// can't learn to guess a position instead of reasoning through the scenario.
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Flattens the structured per-topic JSON (title/description/choices) into
// the flat { scenario, options } shape QuestionScreen and useGameEngine expect.
// safetyImpact is carried through per-choice for when Survival Mode moves
// from a lives counter to the proposal's Safety Points pool.
export const scenarios = topics.flatMap((topicData) =>
  topicData.scenarios.map((s) => ({
    id: s.id,
    topic: topicData.topic,
    topicLabel: topicData.topicLabel,
    title: s.title,
    scenario: s.description,
    options: shuffle(
      s.choices.map((c) => ({
        text: c.text,
        isCorrect: c.correct,
        feedback: c.feedback,
        safetyImpact: c.safetyImpact,
      }))
    ),
  }))
);