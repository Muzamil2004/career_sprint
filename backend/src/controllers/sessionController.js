import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import { generateInterviewProblem } from "../lib/interviewProblemGenerator.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toSafeNonNegativeInt(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
}

function toSafeNonNegativeNumber(value) {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
}

function buildInterviewSummary({ attempts, successfulRuns, participantExists, proctoring = {} }) {
  const safeAttempts = toSafeNonNegativeInt(attempts);
  const safeSuccessfulRuns = clamp(toSafeNonNegativeInt(successfulRuns), 0, safeAttempts);
  const warnings = toSafeNonNegativeInt(proctoring.warnings);
  const violations = toSafeNonNegativeInt(proctoring.violations);
  const totalAwaySeconds = toSafeNonNegativeNumber(proctoring.totalAwaySeconds);
  const maxAwaySeconds = toSafeNonNegativeNumber(proctoring.maxAwaySeconds);

  const problemsSolved = safeSuccessfulRuns > 0 ? 1 : 0;
  const accuracy =
    safeAttempts > 0 ? Math.round((safeSuccessfulRuns / safeAttempts) * 100) : 0;

  // Penalize suspicious behavior: repeated violations and sustained off-screen time lower trust.
  const integrityPenalty = warnings * 3 + violations * 12 + totalAwaySeconds * 0.4 + maxAwaySeconds * 0.6;
  const integrityScore = clamp(Math.round(100 - integrityPenalty), 0, 100);

  let riskLevel = "low";
  if (integrityScore < 55) riskLevel = "high";
  else if (integrityScore < 80) riskLevel = "medium";

  const collaborationBonus = participantExists ? 10 : 0;
  const solvedBonus = problemsSolved ? 10 : 0;
  const integrityBonus = Math.round(integrityScore * 0.2);
  const interviewReadiness = clamp(
    Math.round(accuracy * 0.7 + integrityBonus + collaborationBonus + solvedBonus),
    0,
    100
  );

  return {
    problemsSolved,
    accuracy,
    interviewReadiness,
    attempts: safeAttempts,
    successfulRuns: safeSuccessfulRuns,
    proctoring: {
      warnings,
      violations,
      totalAwaySeconds: Math.round(totalAwaySeconds),
      maxAwaySeconds: Math.round(maxAwaySeconds),
      integrityScore,
      riskLevel,
    },
    generatedAt: new Date(),
  };
}

export async function createSession(req, res) {
  try {
    const {
      problem,
      difficulty,
      selectionMode = "ai_random",
      focus = "situational",
      minDifficulty = "medium",
      enforceFullscreen = true,
      blockClipboard = true,
    } = req.body;
    const userId = req.user._id;

    const allowedDifficulties = new Set(["easy", "medium", "hard"]);
    const allowedFocuses = new Set(["situational", "system-design-lite", "algorithms"]);

    const safeFocus = allowedFocuses.has(focus) ? focus : "situational";
    const isAiRandom = selectionMode === "ai_random";

    let finalProblem = problem;
    let finalDifficulty = difficulty?.toLowerCase();
    let problemPayload = null;

    if (isAiRandom) {
      problemPayload = generateInterviewProblem({ focus: safeFocus, minDifficulty });
      finalProblem = problemPayload.title;
      finalDifficulty = problemPayload.difficulty;
    }

    if (!allowedDifficulties.has(finalDifficulty)) {
      return res.status(400).json({ message: "Invalid difficulty value" });
    }

    if (!finalProblem || !finalDifficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // create session in db
    const session = await Session.create({
      problem: finalProblem,
      difficulty: finalDifficulty,
      problemPayload,
      interviewConfig: {
        selectionMode: isAiRandom ? "ai_random" : "manual",
        focus: safeFocus,
        enforceFullscreen: Boolean(enforceFullscreen),
        blockClipboard: Boolean(blockClipboard),
      },
      host: userId,
      callId,
    });

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: userId.toString(),
        custom: {
          problem: finalProblem,
          difficulty: finalDifficulty,
          sessionId: session._id.toString(),
          interviewConfig: session.interviewConfig,
        },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${finalProblem} Session`,
      created_by_id: userId.toString(),
      members: [userId.toString()],
    });

    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email")
      .populate("participant", "name profileImage email")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage")
      .populate("participant", "name email profileImage");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    // check if session is already full - has a participant
    if (session.participant) return res.status(409).json({ message: "Session is full" });

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([userId.toString()]);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { attempts = 0, successfulRuns = 0, proctoring = {} } = req.body || {};

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    session.interviewSummary = buildInterviewSummary({
      attempts,
      successfulRuns,
      participantExists: Boolean(session.participant),
      proctoring,
    });
    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
