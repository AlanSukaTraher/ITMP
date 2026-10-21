# Game Logic (Disaster Ready)

How scoring, timers, Safety Points, star ratings and level unlocking work.
Owner: Mukhammad Khujaev (React logic). Every number below is a constant in
`src/game/rules.js` (or `TIMER_DEFAULT` in `src/hooks/useGameEngine.js`), so the
game can be tuned in one place.

## Modes

| Mode | What is played | Ends when |
|---|---|---|
| Scenario Mode | One level (one topic, 6 scenarios from that topic's JSON file) in shuffled order, no timer | The 6th scenario is answered |
| Timed Emergency Mode | Same levels, but 3 short scenarios per topic from `timed.json`, each with its own countdown (8, 10 or 12 seconds) | The 3rd scenario is answered |
| Survival Mode | All 20 events from `survival_events.json` (4 per topic) in random order, no repeats | Safety Points reach 0, or all 20 are answered |

Scenario and Timed modes share one level progression. Survival Mode does not use levels.
Answer options are shuffled so the correct answer is not always in the same position.

## Scoring

- Correct answer: **+10 points**.
- Timed mode only: a correct answer also earns a **speed bonus equal to the seconds left** (up to the scenario's time limit), so a correct answer is worth 10 to 22 points.
- Wrong answers and timeouts score 0 (nothing is subtracted).
- Accuracy = correct answers / scenarios answered, rounded to a whole percent.

## Timer (Timed Emergency Mode)

- Each scenario starts at its own `timeLimit` (8, 10 or 12 seconds; 15 if none is set) and counts down once a second.
- The countdown stops while the feedback is showing.
- At 0 the question is answered automatically as **wrong** with that scenario's `timeoutFeedback` (which names the correct action), or "Time's up!" if it has none.
- The bar turns red at **5 seconds or less**.

## Safety Points (Survival Mode)

- The pool starts at **5** and is capped at **7**.
- Every choice has a `safetyImpact` in the scenario JSON, and it is applied right after the player answers:
  - correct choice: **+2** (restores points)
  - wrong choice: **-1, -2 or -3**, depending on how dangerous the choice is
- The pool is clamped between 0 and 7.
- The run ends at **0**. The player still sees the explanation for the fatal answer first.
- If the player answers all 20 events without reaching 0, the run ends as "All emergencies survived".

## Star ratings (levels)

Based on the share of correct answers in a level (`STAR_THRESHOLDS`):

| Share correct | Stars |
|---|---|
| 100% | 3 |
| 60% or more | 2 |
| 30% or more | 1 |
| Less than 30% | 0 |

Examples: Scenario Mode (6 scenarios): 6/6 = 3 stars, 4-5/6 = 2 stars, 2-3/6 = 1 star, 0-1/6 = 0 stars.
Timed Mode (3 scenarios): 3/3 = 3 stars, 2/3 = 2 stars, 1/3 = 1 star, 0/3 = 0 stars.

## Level progression and unlocking

- Order: **Fire, Earthquake, Flood, Storm, First Aid**.
- Fire is always open. A level opens when the **previous level has at least 2 star** (`MIN_STARS_TO_UNLOCK`).
- Levels cannot be skipped. A level with 0 stars is "not passed" and must be retried.
- Replaying a level keeps the **best** rating, so a worse run never lowers it.
- Progress (stars per level) is saved in the browser (`localStorage`, key `disaster-ready-progress-v1`). Best scores are saved under `disaster-ready-best-v1`. Both are per browser, with no backend and no accounts. "Reset progress" on the level screen clears both.
- A new result beats the saved best with a higher score, or the same score in less time.
- If storage is blocked or the saved data is corrupted, the game starts fresh and still works.

## Timing summary

Each scenario's response time is measured from when it is shown until the player answers (reading the feedback is not counted). The results screen shows total time and the average per scenario. A timed-out scenario counts as its full time limit.

## Where the code is

| File | Responsibility |
|---|---|
| `src/game/rules.js` | All constants and pure rules (Safety Points, stars, unlocking, best results, time format) |
| `src/game/levels.js` | Builds the 5 levels from the scenario data (Scenario and Timed banks) |
| `src/hooks/useGameEngine.js` | Game state for one run: score, timer, Safety Points, timing, finish callback |
| `src/hooks/useProgress.js` | Saves and loads level stars |
| `src/hooks/useBest.js` | Saves and loads best scores |
| `src/data/*.json` | Scenario content (owned by the content team) |

## Tests

`npm test` runs `src/game/rules.test.js` (11 tests). It tests the rules above and also checks the scenario JSON, so a content mistake fails the test. It fails if a topic is missing, a scenario has no single correct choice, or a `safetyImpact` has the wrong sign.

## Design decisions to confirm with the team

The proposal leaves these open. Each can be changed in `rules.js`.

1. **Storm** is not in the proposal's level order (Fire, Earthquake, Flood, First Aid), so it was placed before First Aid.
2. **Unlock rule:** the proposal says completing a level unlocks the next. It is implemented as "earn at least 2 star", so answering everything wrong does not unlock it.
3. **Survival is finite:** the proposal says Survival continues until points hit zero, but a perfect player would never finish, so the run also ends after all 15 scenarios.
4. **Survival ignores levels:** it uses all topics, whether or not they are unlocked.
5. **Pool size (5 start, 7 max)** was chosen by simulating random and skilled players. A player guessing at random runs out after about 6 scenarios, and a player who is right 80% of the time usually survives all 15.
