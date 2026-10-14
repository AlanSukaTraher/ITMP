import { useState, useCallback } from 'react';
import { withBestStars } from '../game/rules';

// Level progress lives in the browser (localStorage), so the game stays a
// client-side app with no backend. Shape: { fire: 3, earthquake: 1, ... }
// where each value is the best star rating earned on that level.
const STORAGE_KEY = 'disaster-ready-progress-v1';

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    const clean = {};
    for (const [id, stars] of Object.entries(parsed)) {
      if (Number.isInteger(stars) && stars >= 0 && stars <= 3) clean[id] = stars;
    }
    return clean;
  } catch {
    return {}; // storage blocked or data corrupted: start fresh
  }
}

function save(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable (e.g. private mode): progress just won't persist.
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(load);

  const recordResult = useCallback(
    (levelId, stars) => {
      const next = withBestStars(progress, levelId, stars);
      setProgress(next);
      save(next);
    },
    [progress],
  );

  const resetProgress = useCallback(() => {
    setProgress({});
    save({});
  }, []);

  return { progress, recordResult, resetProgress };
}
