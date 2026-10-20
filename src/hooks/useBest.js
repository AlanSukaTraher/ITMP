import { useState, useCallback } from 'react';
import { isBetterResult } from '../game/rules';

// Best score (and time) per mode and level, saved in the browser like level progress.
// Keys look like "scenario:fire", "timed:flood" or "survival:all".
const STORAGE_KEY = 'disaster-ready-best-v1';

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    const clean = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (Number.isFinite(value?.score) && Number.isFinite(value?.seconds)) clean[key] = value;
    }
    return clean;
  } catch {
    return {};
  }
}

function save(best) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(best));
  } catch {
    // Storage unavailable: bests just won't persist.
  }
}

export function useBest() {
  const [best, setBest] = useState(load);

  // Returns { isNew, previous } so the results screen can say "New best!".
  const recordBest = useCallback(
    (key, score, seconds) => {
      const previous = best[key] ?? null;
      const isNew = isBetterResult(previous, score, seconds);
      if (isNew) {
        const next = { ...best, [key]: { score, seconds } };
        setBest(next);
        save(next);
      }
      return { isNew, previous };
    },
    [best],
  );

  const resetBest = useCallback(() => {
    setBest({});
    save({});
  }, []);

  return { best, recordBest, resetBest };
}
