export const questions = [
  {
    id: 1,
    scenario: "A grease fire starts in a pan while cooking in the kitchen. What should you do?",
    options: [
      { text: "Throw water on the pan immediately", isCorrect: false, feedback: "Never put water on a grease fire! It causes a dangerous oil explosion." },
      { text: "Cover the pan with a metal lid and turn off the heat", isCorrect: true, feedback: "Correct! Starving the fire of oxygen smothers it safely." },
      { text: "Fan the fire with a dish towel", isCorrect: false, feedback: "Fanning provides more oxygen, making the fire spread faster." }
    ]
  },
  {
    id: 2,
    scenario: "Someone near you suddenly collapses and is unresponsive. What is your very first step?",
    options: [
      { text: "Check for scene safety and call emergency services", isCorrect: true, feedback: "Correct! Always ensure the area is safe first and call for professional help." },
      { text: "Give them a glass of water immediately", isCorrect: false, feedback: "Giving water to an unconscious person presents a severe choking hazard." },
      { text: "Wait 10 minutes to see if they wake up", isCorrect: false, feedback: "Immediate action is crucial in medical emergencies." }
    ]
  },
  {
    id: 3,
    scenario: "You're in your office and you smell smoke. There's no alarm yet, but smoke is drifting in from under the door to the hallway.",
    options: [
      { text: "Open the door quickly and look into the hallway", isCorrect: false, feedback: "Never open a door without checking it first. If fire is on the other side, a sudden rush of air can cause a dangerous flashover. Always check before opening." },
      { text: "Feel the door and handle with the back of your hand before opening", isCorrect: true, feedback: "Correct. Checking a door's heat before opening tells you if fire is close on the other side. If it's hot, keep it shut and find another way out." },
      { text: "Ignore it and keep working, assuming it's nothing", isCorrect: false, feedback: "Smoke should never be ignored. It spreads fast and is more dangerous than the flames themselves. Treat any smoke as a sign to act immediately." }
    ]
  },
  {
    id: 4,
    scenario: "The fire alarm goes off. You're on the 6th floor and need to get outside. The elevator is right next to you.",
    options: [
      { text: "Take the elevator down since it's faster", isCorrect: false, feedback: "Elevators can stop working or trap you between floors during a fire, and shafts can fill with smoke. Always use the stairs during a fire evacuation." },
      { text: "Use the stairwell and head to the nearest exit", isCorrect: true, feedback: "Correct. Stairwells are built to stay safer during fires. Knowing at least two exit routes in advance makes this decision automatic under pressure." },
      { text: "Stay at your desk and wait for someone to give instructions", isCorrect: false, feedback: "Waiting wastes critical time. Once an alarm sounds, treat it as real and begin evacuating right away rather than waiting for confirmation." }
    ]
  },
  {
    id: 5,
    scenario: "You open a safe exit door and find the corridor filling with thick smoke. You need to reach the stairwell at the end of the hall.",
    options: [
      { text: "Stay low and crawl toward the stairwell", isCorrect: true, feedback: "Correct. Smoke rises, so the air near the floor stays clearer and cooler for longer. Staying low reduces how much smoke you breathe in." },
      { text: "Run through the corridor standing upright to save time", isCorrect: false, feedback: "Standing up puts your face directly in the thickest, most toxic smoke. Smoke is the leading cause of fire-related deaths, so staying low matters more than speed." },
      { text: "Turn back and shelter in your office instead", isCorrect: false, feedback: "Sheltering in place is only advised when instructed by officials or when exits are fully blocked. Here, a viable escape route still exists, so retreating wastes it." }
    ]
  }
];