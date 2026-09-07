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
  }
];
