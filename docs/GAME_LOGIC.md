# Game Logic (Disaster Ready)

How scoring, timers, Safety Points, star ratings and level unlocking work.
Owner: Mukhammad Khujaev (React logic). Every number below is a constant in
`src/game/rules.js` (or `TIMER_DEFAULT` in `src/hooks/useGameEngine.js`), so the
game can be tuned in one place.

## Modes

| Mode | What is played | Ends when |
|---|---|---|
| Scenario Mode | One level (one topic, 3 scenarios) in fixed order, no timer | The 3rd scenario is answered |
| Timed Emergency Mode | Same levels, 15 second countdown per scenario | The 3rd scenario is answered |
| Survival Mode | All 15 scenarios in random order, no repeats | Safety Points reach 0, or all 15 are answered |

Scenario and Timed modes share one level progression. Survival Mode does not use levels.

## Scoring

- Correct answer: **+10 points**.
- Timed mode only: a correct answer also earns a **speed bonus equal to the seconds left** (0 to 15), so a correct answer is worth 10 to 25 points.
- Wrong answers and timeouts score 0 (nothing is subtracted).
- Accuracy = correct answers / scenarios answered, rounded to a whole percent.

## Timer (Timed Emergency Mode)

- Each scenario starts at **15 seconds** and counts down once a second.
- The countdown stops while the feedback is showing.
- At 0 the question is answered automatically as **wrong** with the message "Time's up!".
- The bar turns red at **5 seconds or less**.

## Safety Points (Survival Mode)

- The pool starts at **5** and is capped at **7**.
- Every choice has a `safetyImpact` in the scenario JSON, and it is applied right after the player answers:
  - correct choice: **+2** (restores points)
  - wrong choice: **-1, -2 or -3**, depending on how dangerous the choice is
- The pool is clamped between 0 and 7.
- The run ends at **0**. The player still sees the explanation for the fatal answer first.
- If the player answers all 15 scenarios without reaching 0, the run ends as "All emergencies survived".
- The bar is green above 50%, yellow at 50% or below, and red at 30% or below.

## Star ratings (levels)

Based on the share of correct answers in a level:

| Result | Stars |
|---|---|
| 100% (3 of 3) | 3 |
| 60% or more (2 of 3) | 2 |
| 30% or more (1 of 3) | 1 |
| Less than 30% (0 of 3) | 0 |

## Level progression and unlocking

- Order: **Fire, Earthquake, Flood, Storm, First Aid**.
- Fire is always open. A level opens when the **previous level has at least 2 star** (`MIN_STARS_TO_UNLOCK`).
- Levels cannot be skipped. A level with 0 stars is "not passed" and must be retried.
- Replaying a level keeps the **best** rating, so a worse run never lowers it.
- Progress is saved in the browser (`localStorage`, key `disaster-ready-progress-v1`), so it survives a reload. It is per browser, with no backend and no accounts. "Reset progress" on the level screen clears it.
- If storage is blocked or the saved data is corrupted, the game starts fresh and still works.

## Timing summary

Each scenario's response time is measured from when it is shown until the player answers (reading the feedback is not counted). The results screen shows total time and the average per scenario. A timed-out scenario counts as the full 15 seconds.

## Where the code is

| File | Responsibility |
|---|---|
| `src/game/rules.js` | All constants and pure rules (Safety Points, stars, unlocking, time format) |
| `src/game/levels.js` | Builds the 5 levels from the scenario data |
| `src/hooks/useGameEngine.js` | Game state for one run: score, timer, Safety Points, timing, finish callback |
| `src/hooks/useProgress.js` | Saves and loads level stars |
| `src/data/*.json` | Scenario content (owned by the content team) |

## Tests

`npm test` runs `src/game/rules.test.js`. It tests the rules above and also checks the scenario JSON, so a content mistake fails the test. It fails if a topic is missing, a scenario has no single correct choice, or a `safetyImpact` has the wrong sign.

## Design decisions to confirm with the team

The proposal leaves these open. Each can be changed in `rules.js`.

1. **Storm** is not in the proposal's level order (Fire, Earthquake, Flood, First Aid), so it was placed before First Aid.
2. **Unlock rule:** the proposal says completing a level unlocks the next. It is implemented as "earn at least 2 star", so answering everything wrong does not unlock it.
3. **Survival is finite:** the proposal says Survival continues until points hit zero, but a perfect player would never finish, so the run also ends after all 15 scenarios.
4. **Survival ignores levels:** it uses all topics, whether or not they are unlocked.
5. **Pool size (5 start, 7 max)** was chosen by simulating random and skilled players. A player guessing at random runs out after about 6 scenarios, and a player who is right 80% of the time usually survives all 15.
