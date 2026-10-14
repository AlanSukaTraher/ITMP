// Pure game rules for Disaster Ready: Safety Points, star ratings, level
// unlocking and time formatting. No React and no imports, so the same code runs
// in the app and in `npm test`. Tune the game by changing the constants below.

// ---- Survival Mode: Safety Points -----------------------------------------
// Wrong choices drain the pool, correct choices restore it (up to the max).
// Each choice carries its own `safetyImpact` in the scenario JSON
// (correct = +2, wrong = -1 to -3).
export const SAFETY_START = 6;
export const SAFETY_MAX = 10;
export const DEFAULT_CORRECT_IMPACT = 2; // used if a choice has no safetyImpact
export const DEFAULT_WRONG_IMPACT = -2;
export const TIMEOUT_IMPACT = -2; // running out of time counts as a wrong answer

export function applySafety(points, impact) {
  return Math.max(0, Math.min(SAFETY_MAX, points + impact));
}

export function impactOf(option) {
  if (typeof option.safetyImpact === 'number') return option.safetyImpact;
  return option.isCorrect ? DEFAULT_CORRECT_IMPACT : DEFAULT_WRONG_IMPACT;
}

// ---- Star ratings (1-3) ------------------------------------------------------
// Share of correct answers needed for each star. With 3 scenarios per level:
// 3 stars = 3/3, 2 stars = 2/3, 1 star = 1/3, no stars = 0/3.
export const STAR_THRESHOLDS = { 3: 1, 2: 0.6, 1: 0.3 };

export function starsFor(correct, total) {
  if (!total) return 0;
  const ratio = correct / total;
  if (ratio >= STAR_THRESHOLDS[3]) return 3;
  if (ratio >= STAR_THRESHOLDS[2]) return 2;
  if (ratio >= STAR_THRESHOLDS[1]) return 1;
  return 0;
}

// ---- Level progression -------------------------------------------------------
// Levels unlock in this order. Storm is not in the proposal's list
// (Fire > Earthquake > Flood > First Aid) so it sits before First Aid.
export const LEVEL_ORDER = ['fire', 'earthquake', 'flood', 'storm', 'first_aid'];

// Stars needed on a level to unlock the next one.
export const MIN_STARS_TO_UNLOCK = 1;

// `progress` maps level id -> best star rating, e.g. { fire: 3, earthquake: 1 }.
// `order` is the list of level ids actually available, in play order.
export function isUnlocked(levelId, progress, order = LEVEL_ORDER) {
  const index = order.indexOf(levelId);
  if (index === -1) return false;
  if (index === 0) return true;
  return (progress[order[index - 1]] ?? 0) >= MIN_STARS_TO_UNLOCK;
}

export function nextLevelId(levelId, order = LEVEL_ORDER) {
  const index = order.indexOf(levelId);
  return index === -1 ? null : (order[index + 1] ?? null);
}

// Keep the best result for a level; never lowers an existing rating.
export function withBestStars(progress, levelId, stars) {
  return { ...progress, [levelId]: Math.max(progress[levelId] ?? 0, stars) };
}

// ---- Timing summary ----------------------------------------------------------
export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
