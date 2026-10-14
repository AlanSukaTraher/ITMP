import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  SAFETY_START,
  SAFETY_MAX,
  LEVEL_ORDER,
  MIN_STARS_TO_UNLOCK,
  applySafety,
  impactOf,
  starsFor,
  isUnlocked,
  nextLevelId,
  withBestStars,
  formatDuration,
} from './rules.js';

test('Safety Points: wrong answers drain, correct answers restore, clamped to 0..max', () => {
  assert.equal(applySafety(6, -3), 3);
  assert.equal(applySafety(3, 2), 5);
  assert.equal(applySafety(9, 2), SAFETY_MAX); // cannot exceed the maximum
  assert.equal(applySafety(2, -3), 0); // cannot go below zero
  assert.ok(SAFETY_START > 0 && SAFETY_START <= SAFETY_MAX);
});

test('impactOf uses the choice value and falls back to defaults', () => {
  assert.equal(impactOf({ isCorrect: false, safetyImpact: -3 }), -3);
  assert.equal(impactOf({ isCorrect: true, safetyImpact: 2 }), 2);
  assert.ok(impactOf({ isCorrect: true }) > 0);
  assert.ok(impactOf({ isCorrect: false }) < 0);
});

test('star ratings for a 3-scenario level', () => {
  assert.equal(starsFor(3, 3), 3);
  assert.equal(starsFor(2, 3), 2);
  assert.equal(starsFor(1, 3), 1);
  assert.equal(starsFor(0, 3), 0);
  assert.equal(starsFor(0, 0), 0);
});

test('stars never decrease as more answers are correct', () => {
  for (const total of [3, 4, 5, 10]) {
    let last = 0;
    for (let correct = 0; correct <= total; correct++) {
      const stars = starsFor(correct, total);
      assert.ok(stars >= last, `${correct}/${total}`);
      last = stars;
    }
    assert.equal(starsFor(total, total), 3);
  }
});

test('levels unlock in order and only after the previous level is passed', () => {
  assert.equal(isUnlocked('fire', {}), true); // first level always open
  assert.equal(isUnlocked('earthquake', {}), false);
  assert.equal(isUnlocked('earthquake', { fire: 0 }), false); // played but not passed
  assert.equal(isUnlocked('earthquake', { fire: MIN_STARS_TO_UNLOCK }), true);
  assert.equal(isUnlocked('flood', { fire: 3 }), false); // cannot skip ahead
  assert.equal(isUnlocked('flood', { fire: 3, earthquake: 3 }), true);
  assert.equal(isUnlocked('not-a-level', { fire: 3 }), false);
});

test('level order matches the proposal and ends with First Aid', () => {
  const idx = (id) => LEVEL_ORDER.indexOf(id);
  assert.ok(idx('fire') < idx('earthquake'));
  assert.ok(idx('earthquake') < idx('flood'));
  assert.ok(idx('flood') < idx('first_aid'));
  assert.equal(LEVEL_ORDER.length, new Set(LEVEL_ORDER).size);
});

test('nextLevelId', () => {
  assert.equal(nextLevelId('fire'), 'earthquake');
  assert.equal(nextLevelId('first_aid'), null);
  assert.equal(nextLevelId('nope'), null);
});

test('best star rating is kept and never lowered', () => {
  let p = withBestStars({}, 'fire', 2);
  assert.deepEqual(p, { fire: 2 });
  p = withBestStars(p, 'fire', 1);
  assert.equal(p.fire, 2);
  p = withBestStars(p, 'fire', 3);
  assert.equal(p.fire, 3);
});

test('formatDuration', () => {
  assert.equal(formatDuration(0), '0:00');
  assert.equal(formatDuration(42.4), '0:42');
  assert.equal(formatDuration(65), '1:05');
  assert.equal(formatDuration(600), '10:00');
});

// ---- Content check: guards the JSON the rules depend on -----------------------
const dataDir = new URL('../data/', import.meta.url);
const topicFiles = {
  fire: 'fire.json',
  earthquake: 'earthquake.json',
  flood: 'flood.json',
  storm: 'storm.json',
  first_aid: 'first_aid.json',
};

test('scenario JSON: every level topic exists and each scenario is well-formed', () => {
  const ids = new Set();
  for (const topic of LEVEL_ORDER) {
    const file = topicFiles[topic];
    assert.ok(file, `no data file registered for level "${topic}"`);
    const data = JSON.parse(readFileSync(new URL(file, dataDir), 'utf8'));
    assert.equal(data.topic, topic);
    assert.ok(data.topicLabel);
    assert.ok(data.scenarios.length > 0, `${topic} has no scenarios`);
    for (const s of data.scenarios) {
      assert.ok(!ids.has(s.id), `duplicate scenario id ${s.id}`);
      ids.add(s.id);
      assert.ok(s.title && s.description, s.id);
      assert.equal(s.choices.filter((c) => c.correct).length, 1, `${s.id} needs exactly one correct choice`);
      for (const c of s.choices) {
        assert.ok(c.text && c.feedback, `${c.id} needs text and feedback`);
        assert.equal(typeof c.safetyImpact, 'number', `${c.id} needs a numeric safetyImpact`);
        assert.equal(c.safetyImpact > 0, c.correct, `${c.id}: safetyImpact sign must match correctness`);
      }
    }
  }
});
