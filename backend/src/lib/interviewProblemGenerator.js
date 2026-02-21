const FOCUS_PRESETS = {
  situational: {
    weight: 5,
    themes: [
      {
        key: "rate-limiter-window",
        title: "Rate Limiter for Burst Traffic",
        category: "Real-world Systems",
        difficulty: "medium",
        functionName: "shouldAllowRequest",
        jsSignature: "(events, limit, windowMs)",
        pySignature: "(events, limit, window_ms)",
        javaSignature: "(List<Integer> events, int limit, int windowMs)",
        examples: [
          {
            input: "events = [0, 100, 200, 800, 900], limit = 3, windowMs = 500",
            output: "[true, true, true, false, true]",
            explanation: "The 4th event exceeds 3 requests within the last 500ms window.",
          },
          {
            input: "events = [10, 11, 12, 13], limit = 2, windowMs = 3",
            output: "[true, true, false, true]",
          },
        ],
        constraints: [
          "1 <= events.length <= 2 * 10^5",
          "events is non-decreasing",
          "0 <= events[i] <= 10^9",
        ],
      },
      {
        key: "warehouse-priority-queue",
        title: "Warehouse Pick Priority Scheduler",
        category: "Operations Scenario",
        difficulty: "medium",
        functionName: "nextPickOrder",
        jsSignature: "(orders, capacity)",
        pySignature: "(orders, capacity)",
        javaSignature: "(List<int[]> orders, int capacity)",
        examples: [
          {
            input: "orders = [[4, 30], [2, 90], [6, 40]], capacity = 7",
            output: "[1, 0]",
            explanation: "Pick by highest priority score while respecting remaining capacity.",
          },
        ],
        constraints: [
          "orders[i] = [size, priority]",
          "1 <= orders.length <= 10^5",
          "1 <= size, priority <= 10^4",
        ],
      },
      {
        key: "incident-dedup",
        title: "Incident Alert Deduplication",
        category: "Reliability Engineering",
        difficulty: "hard",
        functionName: "deduplicateAlerts",
        jsSignature: "(alerts, dedupSeconds)",
        pySignature: "(alerts, dedup_seconds)",
        javaSignature: "(List<String[]> alerts, int dedupSeconds)",
        examples: [
          {
            input: "alerts = [[\"db_down\",\"100\"],[\"db_down\",\"110\"],[\"cache_hot\",\"112\"],[\"db_down\",\"170\"]], dedupSeconds = 60",
            output: "[[\"db_down\",100],[\"cache_hot\",112],[\"db_down\",170]]",
          },
        ],
        constraints: [
          "alerts[i] = [eventKey, timestamp]",
          "timestamps are non-decreasing",
          "1 <= alerts.length <= 2 * 10^5",
        ],
      },
    ],
  },
  "system-design-lite": {
    weight: 3,
    themes: [
      {
        key: "tiny-lru",
        title: "Tiny LRU Cache Core",
        category: "System Design Lite",
        difficulty: "hard",
        functionName: "runCacheOps",
        jsSignature: "(capacity, ops)",
        pySignature: "(capacity, ops)",
        javaSignature: "(int capacity, List<String[]> ops)",
        examples: [
          {
            input: "capacity = 2, ops = [[\"put\",\"1\",\"10\"],[\"put\",\"2\",\"20\"],[\"get\",\"1\"],[\"put\",\"3\",\"30\"],[\"get\",\"2\"]]",
            output: "[null, null, 10, null, -1]",
          },
        ],
        constraints: [
          "1 <= ops.length <= 2 * 10^5",
          "1 <= capacity <= 3000",
          "All operations should be O(1) average",
        ],
      },
      {
        key: "leaderboard-window",
        title: "Rolling Leaderboard Window",
        category: "Analytics Backend",
        difficulty: "medium",
        functionName: "topKPlayers",
        jsSignature: "(events, windowSeconds, k)",
        pySignature: "(events, window_seconds, k)",
        javaSignature: "(List<int[]> events, int windowSeconds, int k)",
        examples: [
          {
            input: "events = [[1, 10, 5], [2, 10, 3], [3, 11, 9], [12, 10, 4]], windowSeconds = 10, k = 2",
            output: "[[10,8],[11,9]]",
          },
        ],
        constraints: [
          "events[i] = [timestamp, playerId, scoreDelta]",
          "events are sorted by timestamp",
          "1 <= events.length <= 10^5",
        ],
      },
    ],
  },
  algorithms: {
    weight: 2,
    themes: [
      {
        key: "delivery-slots",
        title: "Delivery Slot Feasibility",
        category: "Greedy + Intervals",
        difficulty: "medium",
        functionName: "maxDeliveries",
        jsSignature: "(slots)",
        pySignature: "(slots)",
        javaSignature: "(List<int[]> slots)",
        examples: [
          {
            input: "slots = [[1,2],[2,3],[3,4],[1,3]]",
            output: "3",
          },
        ],
        constraints: [
          "slots[i] = [start, end]",
          "1 <= slots.length <= 2 * 10^5",
          "start < end",
        ],
      },
      {
        key: "feature-flag-dependencies",
        title: "Feature Flag Dependency Resolver",
        category: "Graph + Topological Sort",
        difficulty: "hard",
        functionName: "buildOrder",
        jsSignature: "(flags, dependencies)",
        pySignature: "(flags, dependencies)",
        javaSignature: "(List<String> flags, List<String[]> dependencies)",
        examples: [
          {
            input: "flags = [\"A\",\"B\",\"C\"], dependencies = [[\"A\",\"B\"],[\"B\",\"C\"]]",
            output: "[\"C\",\"B\",\"A\"]",
          },
        ],
        constraints: [
          "No duplicate flags",
          "Return [] when cycle exists",
          "1 <= flags.length <= 10^4",
        ],
      },
    ],
  },
};

const SITUATION_PROMPTS = [
  "An interviewer says your service must survive flash-sale spikes without dropping requests.",
  "You are handed a production incident timeline and asked to code the core recovery logic.",
  "A hiring manager asks for a clean, testable solution that can be explained under pressure.",
  "Your teammate just introduced latency regressions and you need a robust fix quickly.",
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function weightedFocusPick(requestedFocus) {
  if (requestedFocus && FOCUS_PRESETS[requestedFocus]) {
    return requestedFocus;
  }

  const entries = Object.entries(FOCUS_PRESETS);
  const totalWeight = entries.reduce((sum, [, value]) => sum + value.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const [focus, value] of entries) {
    roll -= value.weight;
    if (roll <= 0) return focus;
  }

  return "situational";
}

function buildStarterCode(template) {
  return {
    javascript: `function ${template.functionName}${template.jsSignature} {\n  // Implement the interview-ready solution here\n}\n\n// Optional: add local test cases below`,
    python: `def ${template.functionName}${template.pySignature}:\n    # Implement the interview-ready solution here\n    pass\n\n# Optional: add local test cases below`,
    java: `import java.util.*;\n\nclass Solution {\n    public static Object ${template.functionName}${template.javaSignature} {\n        // Implement the interview-ready solution here\n        return null;\n    }\n}`,
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

export function generateInterviewProblem({ focus, minDifficulty = "medium" } = {}) {
  const selectedFocus = weightedFocusPick(focus);
  const focusBundle = FOCUS_PRESETS[selectedFocus];
  const selectedTheme = pickRandom(focusBundle.themes);

  const difficulty = sanitizeDifficulty(minDifficulty, selectedTheme.difficulty);
  const scenarioLine = pickRandom(SITUATION_PROMPTS);

  return {
    id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: selectedTheme.title,
    difficulty,
    category: selectedTheme.category,
    promptType: "interview-scenario",
    aiGenerated: true,
    description: {
      text: `${scenarioLine} Build a solution for: ${selectedTheme.title}.`,
      notes: [
        "Explain tradeoffs out loud as if you're in a live interview.",
        "Prefer readability first, then optimize if needed.",
      ],
    },
    examples: selectedTheme.examples,
    constraints: selectedTheme.constraints,
    starterCode: buildStarterCode(selectedTheme),
    expectedOutput: {},
    focus: selectedFocus,
    generatedAt: new Date().toISOString(),
  };
}
