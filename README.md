# Disaster Ready

**An Interactive Emergency Response and Survival Awareness Game**

Disaster Ready is a browser game that teaches emergency safety through quick decisions. You face realistic situations (a kitchen fire, a flash flood, an earthquake at night) and pick the safest action. After every choice you see why it was right or wrong, so the lesson sticks.

**Play it:** 

Course project for FIT3081 IT Mini Project (Multimedia & Gaming), Xiamen University Malaysia, Foundation in IT. Supervisor: Mr. Foong.

## Features

- **5 emergency topics:** Fire in a Building, Earthquake, Flash Flood, Severe Storm / Tornado and First Aid, with 6 scenarios each (30 in total).
- **3 game modes:**
  - **Scenario Mode:** play each topic as a level and earn a running score.
  - **Timed Emergency Mode:** the same levels with a 15 second countdown per scenario. Faster correct answers earn bonus points.
  - **Survival Mode:** random scenarios from every topic. Wrong choices drain your Safety Points, correct ones restore them. The run ends when they reach zero.
- **Level progression:** Fire, Earthquake, Flood, Storm, First Aid. Earn at least 2 stars on a level to unlock the next.
- **Results after every level:** score, 1 to 3 stars, accuracy, total time, average time per scenario, and your best score.
- **Review your mistakes:** see what you chose, the safest action and the explanation.
- **Sound and music:** sound effects, lobby music and a mute button.
- **Keyboard support:** press A, B or C (or 1, 2, 3) to answer and Enter to continue.
- **Works on phones and desktops.** Progress is saved in your browser.

## How scoring works

| Item | Rule |
|---|---|
| Correct answer | +10 points |
| Timed Mode bonus | + the seconds left on the timer (up to 15) |
| Wrong answer or timeout | 0 points |
| Stars | 3 stars for 100% correct, 2 stars for 60% or more, 1 star for 30% or more |
| Survival Safety Points | start at 5, maximum 7, each choice adds or removes points |

## Run it locally

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
git clone https://github.com/AlanSukaTraher/ITMP.git
cd ITMP
npm install
npm run dev
```

Open the link that appears in the terminal (usually http://localhost:5173).

| Command | What it does |
|---|---|
| `npm run dev` | Start the game in development mode |
| `npm run build` | Build the game into the `dist` folder |
| `npm run preview` | Preview the built game locally |
| `npm run build:offline` | Build one single HTML file that works without a server |
| `npm test` | Run the unit tests |
| `npm run lint` | Check the code style |

If the project is inside a subfolder of the repo, run the commands from the folder that contains `package.json`.

## Project structure

```
src/
  App.jsx                 Screen flow: menu, levels, game, results
  components/             Mode select, level select, question and results screens
  hooks/
    useGameEngine.js      Game logic for all 3 modes: score, timer, Safety Points
    useProgress.js        Saves stars per level in the browser
    useBest.js            Saves best scores in the browser
  game/
    rules.js              Scoring, stars, unlocking and Safety Point rules
    levels.js             Level list built from the scenario data
    rules.test.js         Unit tests, including checks of the scenario data
  data/                   One JSON file per topic holding all scenarios and feedback
  audio/ and assets/      Sound effects, music and icons
```

All scenario content lives in the JSON files in `src/data`, separate from the game code. To add a scenario, copy an existing one, give it a new `id`, and keep exactly one choice marked `"correct": true`. `npm test` checks this.

## Built with

React 19, Vite, plain CSS and JavaScript (ES6). There is no backend, no database and no accounts. Everything runs in the browser.

## Team (Group 2)