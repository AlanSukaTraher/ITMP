import { scenarios } from '../data/scenarios';
import { LEVEL_ORDER } from './rules';

// Topic icons shown on the level cards and scenario headers.
export const TOPIC_ICONS = {
  fire: '🔥',
  flood: '🌊',
  storm: '🌪️',
  earthquake: '🏚️',
  first_aid: '🩹',
};

export const ALL_SCENARIOS = scenarios;

// One level per topic, in unlock order. A topic with no scenarios is skipped,
// so adding or removing content never breaks the progression.
export const LEVELS = LEVEL_ORDER.map((id) => {
  const list = scenarios.filter((s) => s.topic === id);
  return {
    id,
    label: list[0]?.topicLabel ?? id,
    icon: TOPIC_ICONS[id] ?? '⚠️',
    scenarios: list,
  };
}).filter((level) => level.scenarios.length > 0);

export const LEVEL_IDS = LEVELS.map((level) => level.id);
