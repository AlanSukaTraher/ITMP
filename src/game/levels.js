import { scenarios, timedScenarios, survivalEvents } from '../data/scenarios';
import { LEVEL_ORDER } from './rules';

// Topic icons are image names resolved by <Icon /> (see components/Icons.jsx).
export const TOPIC_ICONS = {
  fire: 'fire',
  flood: 'flood',
  storm: 'storm',
  earthquake: 'earthquake',
  first_aid: 'first_aid',
};

// Survival Mode draws from its own larger event bank instead of the level scenarios.
export const ALL_SCENARIOS = survivalEvents;

// One level per topic, in unlock order. A topic with no scenarios is skipped,
// so adding or removing content never breaks the progression.
function buildLevels(bank) {
  return LEVEL_ORDER.map((id) => {
    const list = bank.filter((s) => s.topic === id);
    return {
      id,
      label: list[0]?.topicLabel ?? id,
      icon: TOPIC_ICONS[id] ?? null,
      scenarios: list,
    };
  }).filter((level) => level.scenarios.length > 0);
}

// Scenario Mode levels, and Timed Emergency Mode levels (same topics and
// unlock order, but they play the short scenarios from timed.json).
export const LEVELS = buildLevels(scenarios);
export const TIMED_LEVELS = buildLevels(timedScenarios);

export const LEVEL_IDS = LEVELS.map((level) => level.id);
