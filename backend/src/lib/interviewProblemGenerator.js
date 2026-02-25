const FOCUS_PRESETS = {
  coding: {
    weight: 5,
    themes: [
      {
        title: "Sliding Window Duplicate Detector",
        category: "Coding Interview",
        difficulty: "medium",
        functionName: "hasNearbyDuplicate",
        jsSignature: "(nums, k)",
        pySignature: "(nums, k)",
        javaSignature: "(int[] nums, int k)",
        examples: [
          { input: "nums = [1, 2, 3, 1], k = 3", output: "true" },
          { input: "nums = [1, 0, 1, 1], k = 1", output: "true" },
        ],
        constraints: [
          "1 <= nums.length <= 10^5",
          "-10^9 <= nums[i] <= 10^9",
          "0 <= k <= 10^5",
        ],
      },
      {
        title: "Minimum Meeting Rooms",
        category: "Coding Interview",
        difficulty: "hard",
        functionName: "minMeetingRooms",
        jsSignature: "(intervals)",
        pySignature: "(intervals)",
        javaSignature: "(List<int[]> intervals)",
        examples: [
          { input: "intervals = [[0,30],[5,10],[15,20]]", output: "2" },
          { input: "intervals = [[7,10],[2,4]]", output: "1" },
        ],
        constraints: [
          "1 <= intervals.length <= 10^5",
          "intervals[i] = [start, end]",
          "0 <= start < end <= 10^6",
        ],
      },
    ],
  },
  "system-design": {
    weight: 3,
    themes: [
      {
        title: "Design a URL Shortener Core",
        category: "System Design Interview",
        difficulty: "medium",
        functionName: "designUrlShortener",
        jsSignature: "(requirements)",
        pySignature: "(requirements)",
        javaSignature: "(Map<String, Object> requirements)",
        examples: [
          {
            input: "requirements = { dailyUrls: 1000000, customAlias: true, analytics: true }",
            output: "A short, scalable architecture with APIs, data model, cache, and tradeoffs",
          },
        ],
        constraints: [
          "Address read-heavy traffic and unique key generation.",
          "Describe scaling, reliability, and observability choices.",
        ],
      },
      {
        title: "Design a Notification Service",
        category: "System Design Interview",
        difficulty: "hard",
        functionName: "designNotificationService",
        jsSignature: "(requirements)",
        pySignature: "(requirements)",
        javaSignature: "(Map<String, Object> requirements)",
        examples: [
          {
            input: "requirements = { channels: [email,sms,push], retries: true, peakQps: 50000 }",
            output: "A resilient queue-driven architecture with retries, dedup, and monitoring",
          },
        ],
        constraints: [
          "Support fan-out, retries, and idempotency.",
          "Explain failure handling and rate limiting.",
        ],
      },
    ],
  },
  aptitude: {
    weight: 2,
    themes: [
      {
        title: "Time and Work Mixer",
        category: "Aptitude Interview",
        difficulty: "medium",
        functionName: "solveAptitudeSet",
        jsSignature: "(questions)",
        pySignature: "(questions)",
        javaSignature: "(List<String> questions)",
        examples: [
          {
            input: "A completes work in 6 days, B in 8 days. Together?",
            output: "24/7 days",
          },
          {
            input: "If 20% of x is 48, find x",
            output: "240",
          },
        ],
        constraints: [
          "Show clean step-by-step calculations.",
          "Prefer exact values over rounded decimals unless asked.",
        ],
      },
      {
        title: "Profit, Loss, and Percentages",
        category: "Aptitude Interview",
        difficulty: "hard",
        functionName: "solveAptitudeSet",
        jsSignature: "(questions)",
        pySignature: "(questions)",
        javaSignature: "(List<String> questions)",
        examples: [
          {
            input: "Marked price is 2500, discount 20%, then 5% GST. Final price?",
            output: "2100",
          },
        ],
        constraints: [
          "Use percentage transformations carefully.",
          "Keep units and intermediate values clear.",
        ],
      },
    ],
  },
  verbal: {
    weight: 2,
    themes: [
      {
        title: "Grammar and Sentence Correction",
        category: "Verbal Interview",
        difficulty: "medium",
        functionName: "solveVerbalSet",
        jsSignature: "(questions)",
        pySignature: "(questions)",
        javaSignature: "(List<String> questions)",
        examples: [
          {
            input: "Correct: 'Each of the players have a kit.'",
            output: "'Each of the players has a kit.'",
          },
        ],
        constraints: [
          "Answer with corrected sentence and one-line rule.",
          "Keep wording concise and grammatically precise.",
        ],
      },
      {
        title: "Reading Comprehension and Vocabulary",
        category: "Verbal Interview",
        difficulty: "hard",
        functionName: "solveVerbalSet",
        jsSignature: "(questions)",
        pySignature: "(questions)",
        javaSignature: "(List<String> questions)",
        examples: [
          {
            input: "Find synonym of 'concise' and use it in a sentence.",
            output: "Synonym: brief. Sentence: She gave a brief and clear update.",
          },
        ],
        constraints: [
          "Prefer direct, context-aware vocabulary choices.",
          "Avoid overlong explanations unless prompted.",
        ],
      },
    ],
  },
};

const FOCUS_ALIASES = {
  situational: "coding",
  algorithms: "coding",
  "system-design-lite": "system-design",
};

const SITUATION_PROMPTS = {
  coding: [
    "The interviewer wants an optimized coding solution with a clean explanation.",
    "You are asked to solve this as if in a live whiteboard round.",
  ],
  "system-design": [
    "The interviewer asks for a production-ready architecture with trade-offs.",
    "You need to design a scalable system and justify each component.",
  ],
  aptitude: [
    "The interviewer evaluates speed, accuracy, and clarity of calculations.",
    "You are expected to show a clear step-by-step numerical approach.",
  ],
  verbal: [
    "The interviewer is assessing grammar, precision, and communication clarity.",
    "You need concise, correct responses with brief justification.",
  ],
};

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function normalizeFocus(requestedFocus) {
  if (FOCUS_PRESETS[requestedFocus]) return requestedFocus;
  return FOCUS_ALIASES[requestedFocus] || "coding";
}

function weightedFocusPick(requestedFocus) {
  const normalized = normalizeFocus(requestedFocus);
  if (requestedFocus && FOCUS_PRESETS[normalized]) return normalized;

  const entries = Object.entries(FOCUS_PRESETS);
  const totalWeight = entries.reduce((sum, [, value]) => sum + value.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const [focus, value] of entries) {
    roll -= value.weight;
    if (roll <= 0) return focus;
  }
  return "coding";
}

function buildStarterCode(template, focus) {
  const commonHint =
    focus === "coding"
      ? "Implement the interview-ready solution."
      : "Write your structured answer in code comments or plain text.";

  return {
    javascript: `function ${template.functionName}${template.jsSignature} {\n  // ${commonHint}\n}\n\n// Optional: add your notes/tests below`,
    python: `def ${template.functionName}${template.pySignature}:\n    # ${commonHint}\n    pass\n\n# Optional: add your notes/tests below`,
    java: `import java.util.*;\n\nclass Solution {\n    public static Object ${template.functionName}${template.javaSignature} {\n        // ${commonHint}\n        return null;\n    }\n}`,
  };
}

function sanitizeDifficulty(minDifficulty, difficulty) {
  const order = ["easy", "medium", "hard"];
  const minIndex = order.indexOf(minDifficulty);
  const candidateIndex = order.indexOf(difficulty);

  if (minIndex === -1 || candidateIndex === -1) return difficulty;
  if (candidateIndex >= minIndex) return difficulty;
  return minDifficulty;
}

function byMinDifficulty(themes, minDifficulty) {
  const order = ["easy", "medium", "hard"];
  const minIndex = order.indexOf(minDifficulty);
  if (minIndex === -1) return themes;

  const filtered = themes.filter((theme) => order.indexOf(theme.difficulty) >= minIndex);
  return filtered.length > 0 ? filtered : themes;
}

export function generateInterviewProblem({ focus, minDifficulty = "medium" } = {}) {
  const selectedFocus = weightedFocusPick(focus);
  const focusBundle = FOCUS_PRESETS[selectedFocus];
  const eligibleThemes = byMinDifficulty(focusBundle.themes, minDifficulty);
  const selectedTheme = pickRandom(eligibleThemes);
  const difficulty = sanitizeDifficulty(minDifficulty, selectedTheme.difficulty);
  const scenarioLine = pickRandom(SITUATION_PROMPTS[selectedFocus]);

  return {
    id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: selectedTheme.title,
    difficulty,
    category: selectedTheme.category,
    promptType: "interview-scenario",
    aiGenerated: true,
    description: {
      text: `${scenarioLine} Prompt: ${selectedTheme.title}.`,
      notes: [
        "Think aloud as if this is a real interview round.",
        "Be explicit about trade-offs, assumptions, and edge cases.",
      ],
    },
    examples: selectedTheme.examples,
    constraints: selectedTheme.constraints,
    starterCode: buildStarterCode(selectedTheme, selectedFocus),
    expectedOutput: {},
    focus: selectedFocus,
    generatedAt: new Date().toISOString(),
  };
}
