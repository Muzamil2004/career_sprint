import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Loader2Icon,
  LogOutIcon,
  PhoneOffIcon,
  ScanFaceIcon,
  TimerIcon,
} from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import useStreamClient from "../hooks/useStreamClient";
import useEyeProctoring from "../hooks/useEyeProctoring";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import { useAuth } from "../context/AuthContext";
import { aiApi } from "../api/ai";

function normalizeOutput(text) {
  return String(text ?? "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function SessionPage() {
  const SESSION_DURATION_SECONDS = 60 * 60;
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [output, setOutput] = useState(null);
  const [testsPassed, setTestsPassed] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runStats, setRunStats] = useState({ attempts: 0, successfulRuns: 0 });
  const [summaryPresented, setSummaryPresented] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(SESSION_DURATION_SECONDS);
  const [autoEndTriggered, setAutoEndTriggered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== "undefined" ? Boolean(document.fullscreenElement) : true
  );

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const currentUserId = user?._id || user?.id;
  const isHost = session?.host?._id === currentUserId;
  const isParticipant = session?.participant?._id === currentUserId;

  const { call, channel, chatClient, isInitializingCall, streamClient, teardownSessionMedia } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  const interviewConfig = session?.interviewConfig || {};
  const sessionFocus = interviewConfig.focus || "coding";
  const shouldBlockClipboard = interviewConfig.blockClipboard !== false;
  const shouldEnforceFullscreen = interviewConfig.enforceFullscreen !== false;
  const shouldEnableEyeProctoring = shouldEnforceFullscreen;

  const {
    videoRef,
    awaySeconds,
    totalAwaySeconds,
    maxAwaySeconds,
    warnings,
    warningMessage,
    violations,
    isLocked: isEyeLockActive,
    status: eyeStatus,
    stopProctoring,
  } = useEyeProctoring({ enabled: shouldEnableEyeProctoring });

  // use generated payload first, then fallback to static bank by title
  const problemData =
    session?.problemPayload ||
    (session?.problem ? Object.values(PROBLEMS).find((p) => p.title === session.problem) : null);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");
  const expectedOutput = problemData?.expectedOutput?.[selectedLanguage];

  const buildFeedbackPrompt = (focus) => {
    if (focus === "system-design") {
      return "Give concise interview feedback for a system design round using the session context. Provide exactly 4 bullet tips and then a short architecture-improvement analysis with tradeoffs, scaling, and reliability notes. Format exactly as:\nTIPS:\n- ...\n- ...\n- ...\n- ...\nANALYSIS:\n<2-4 short paragraphs>";
    }
    if (focus === "aptitude") {
      return "Give concise interview feedback for an aptitude round using the session context. Provide exactly 4 bullet tips and then a short improvement analysis focused on accuracy, speed, and calculation strategy. Format exactly as:\nTIPS:\n- ...\n- ...\n- ...\n- ...\nANALYSIS:\n<2-4 short paragraphs>";
    }
    if (focus === "verbal") {
      return "Give concise interview feedback for a verbal round using the session context. Provide exactly 4 bullet tips and then a short improvement analysis focused on grammar, clarity, and communication quality. Format exactly as:\nTIPS:\n- ...\n- ...\n- ...\n- ...\nANALYSIS:\n<2-4 short paragraphs>";
    }
    return "Give concise interview tips based on this session summary. Keep it short and actionable with 4 bullet points. Then provide a detailed optimization analysis explaining how to improve the time complexity for this problem. Format exactly as:\nTIPS:\n- ...\n- ...\n- ...\n- ...\nANALYSIS:\n<2-4 short paragraphs>";
  };

  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed" && session.interviewSummary && !summaryPresented) {
      presentSessionSummary(session.interviewSummary);
    } else if (session.status === "completed" && !isHost && !session.interviewSummary) {
      navigate("/dashboard");
    }
  }, [session, loadingSession, navigate, isHost, summaryPresented]);

  useEffect(() => {
    if (!session?.createdAt || session?.status !== "active") return;

    const updateTimeLeft = () => {
      const createdAt = new Date(session.createdAt).getTime();
      const endTime = createdAt + SESSION_DURATION_SECONDS * 1000;
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeftSeconds(remaining);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [session?.createdAt, session?.status]);

  useEffect(() => {
    if (!session || session.status !== "active" || !isHost || autoEndTriggered) return;
    if (timeLeftSeconds > 0) return;

    setAutoEndTriggered(true);
    endSessionMutation.mutate(
      {
        id,
        summary: {
          attempts: runStats.attempts,
          successfulRuns: runStats.successfulRuns,
          proctoring: {
            warnings,
            violations,
            totalAwaySeconds: Math.round(totalAwaySeconds + awaySeconds),
            maxAwaySeconds: Math.round(Math.max(maxAwaySeconds, awaySeconds)),
          },
        },
      },
      {
        onSuccess: (data) => {
          presentSessionSummary(data?.session?.interviewSummary || null);
        },
      }
    );
  }, [
    autoEndTriggered,
    endSessionMutation,
    id,
    isHost,
    runStats.attempts,
    runStats.successfulRuns,
    session,
    timeLeftSeconds,
  ]);

  // update code when problem loads or changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  useEffect(() => {
    if (!shouldEnforceFullscreen) return;

    const tryEnterFullscreen = async () => {
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        } catch {
          setIsFullscreen(false);
        }
      }
    };

    tryEnterFullscreen();

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [shouldEnforceFullscreen]);

  useEffect(() => {
    if (!shouldBlockClipboard) return;

    const preventClipboard = (event) => event.preventDefault();
    const preventShortcut = (event) => {
      const key = event.key?.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && ["c", "v", "x", "a"].includes(key)) {
        event.preventDefault();
      }
    };

    document.addEventListener("copy", preventClipboard);
    document.addEventListener("cut", preventClipboard);
    document.addEventListener("paste", preventClipboard);
    document.addEventListener("contextmenu", preventClipboard);
    window.addEventListener("keydown", preventShortcut);

    return () => {
      document.removeEventListener("copy", preventClipboard);
      document.removeEventListener("cut", preventClipboard);
      document.removeEventListener("paste", preventClipboard);
      document.removeEventListener("contextmenu", preventClipboard);
      window.removeEventListener("keydown", preventShortcut);
    };
  }, [shouldBlockClipboard]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    // use problem-specific starter code
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
    setTestsPassed(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    setTestsPassed(null);

    const result = await executeCode(selectedLanguage, code);
    const runPassed =
      result?.success &&
      (expectedOutput
        ? normalizeOutput(result?.output) === normalizeOutput(expectedOutput)
        : normalizeOutput(result?.output) !== "" && normalizeOutput(result?.output) !== "No output");

    setOutput(result);
    setTestsPassed(runPassed);
    setRunStats((prev) => ({
      attempts: prev.attempts + 1,
      successfulRuns: prev.successfulRuns + (runPassed ? 1 : 0),
    }));
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      endSessionMutation.mutate(
        {
          id,
          summary: {
            attempts: runStats.attempts,
            successfulRuns: runStats.successfulRuns,
            proctoring: {
              warnings,
              violations,
              totalAwaySeconds: Math.round(totalAwaySeconds + awaySeconds),
              maxAwaySeconds: Math.round(Math.max(maxAwaySeconds, awaySeconds)),
            },
          },
        },
        {
          onSuccess: (data) => {
            presentSessionSummary(data?.session?.interviewSummary || null);
          },
        }
      );
    }
  };

  const handleBottomLeave = async () => {
    if (isHost && session?.status === "active") {
      handleEndSession();
      return;
    }

    await teardownSessionMedia();
    stopProctoring();
    navigate("/dashboard");
  };

  const handleEnterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch {
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const openSummaryPopup = (summary, tips) => {
    if (typeof window === "undefined") return false;

    const payload = {
      sessionId: id,
      problem: session?.problem || "",
      summary,
      tips: tips?.tips || "",
      analysis: tips?.analysis || "",
      generatedAt: new Date().toISOString(),
    };

    window.sessionStorage.setItem("session-summary-popup", JSON.stringify(payload));
    navigate("/session-summary");
    return true;
  };

  const presentSessionSummary = async (summary) => {
    if (!summary || summaryPresented) return;

    setSummaryPresented(true);

    let tips = {
      tips: "Focus on writing cleaner dry runs, edge-case checks, and complexity explanations.",
      analysis:
        "Analyze the current approach, identify bottlenecks, and look for hash maps, two pointers, sorting, or dynamic programming strategies that reduce time complexity.",
    };

    try {
      const response = await aiApi.getFeedback({
        prompt: buildFeedbackPrompt(sessionFocus),
        problem: session?.problem || "",
        language: selectedLanguage,
        code,
      });
      const feedback = response?.feedback || "";
      const tipsMatch = feedback.match(/TIPS:\s*([\s\S]*?)\n\s*ANALYSIS:/i);
      const analysisMatch = feedback.match(/ANALYSIS:\s*([\s\S]*)/i);
      const parsedTips = tipsMatch ? tipsMatch[1].trim() : "";
      const parsedAnalysis = analysisMatch ? analysisMatch[1].trim() : "";
      tips = {
        tips: parsedTips || feedback || tips.tips,
        analysis: parsedAnalysis || tips.analysis,
      };
    } catch {
      tips = {
        tips: "Focus on writing cleaner dry runs, edge-case checks, and complexity explanations.",
        analysis:
          "Analyze the current approach, identify bottlenecks, and look for hash maps, two pointers, sorting, or dynamic programming strategies that reduce time complexity.",
      };
    }

    await teardownSessionMedia();
    stopProctoring();
    openSummaryPopup(summary, tips);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[var(--app-bg-start)] via-[var(--app-bg-mid)] to-[var(--app-bg-end)] flex flex-col">
      {shouldEnforceFullscreen && !isFullscreen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white text-slate-900 p-6 text-center">
            <ScanFaceIcon className="size-10 mx-auto mb-3 text-slate-700" />
            <h2 className="display-font text-2xl font-bold">Interview Mode Locked</h2>
            <p className="mt-2 text-sm text-slate-600">
              This session requires full-screen mode. Re-enter to continue the interview.
            </p>
            <button
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500"
              onClick={handleEnterFullscreen}
            >
              Enter Full Screen
            </button>
          </div>
        </div>
      )}
      {shouldEnableEyeProctoring && isEyeLockActive && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white text-slate-900 p-6 text-center">
            <ScanFaceIcon className="size-10 mx-auto mb-3 text-rose-600" />
            <h2 className="display-font text-2xl font-bold">Eyes On Screen</h2>
            <p className="mt-2 text-sm text-slate-600">
              Interview mode detected off-screen focus for too long. Please refocus to continue.
            </p>
            <p className="mt-3 text-xs font-semibold text-rose-600">
              Proctoring flags: {violations}
            </p>
          </div>
        </div>
      )}
      {shouldEnableEyeProctoring &&
        !isEyeLockActive &&
        (eyeStatus === "looking-away" || eyeStatus === "no-face") &&
        awaySeconds >= 0.35 && (
          <div className="absolute left-1/2 top-4 z-[60] -translate-x-1/2 rounded-lg border border-amber-300 bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm">
            {warningMessage || "Please keep your eyes on screen to continue the interview."}
          </div>
        )}
      {shouldEnableEyeProctoring && (
        <video
          ref={videoRef}
          className="pointer-events-none fixed -left-[9999px] -top-[9999px] h-px w-px opacity-0"
          muted
          playsInline
          autoPlay
        />
      )}

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DSC PANEL */}
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full overflow-y-auto bg-[var(--app-bg-mid)]">
                  {/* HEADER SECTION */}
                  <div className="p-6 bg-[var(--surface)] border-b border-[var(--line)]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="display-font text-3xl font-bold text-[var(--text-primary)]">
                          {session?.problem || "Loading..."}
                        </h1>
                        {problemData?.category && (
                          <p className="text-[var(--text-muted)] mt-1">{problemData.category}</p>
                        )}
                        <p className="text-[var(--text-muted)] mt-2">
                          Host: {session?.host?.name || "Loading..."} •{" "}
                          {session?.participant ? 2 : 1}/2 participants
                        </p>
                        {shouldEnableEyeProctoring && (
                          <p className="mt-2 text-xs text-[var(--text-muted)]">
                            Proctoring:{" "}
                            <span
                              className={
                                eyeStatus === "focused"
                                  ? "text-emerald-600 font-semibold"
                                  : eyeStatus === "error"
                                  ? "text-rose-600 font-semibold"
                                  : "text-amber-600 font-semibold"
                              }
                            >
                              {eyeStatus === "focused"
                                ? "Focused"
                                : eyeStatus === "looking-away"
                                ? `Looking away (${awaySeconds.toFixed(1)}s)`
                                : eyeStatus === "no-face"
                                ? "Face not visible"
                                : eyeStatus === "error"
                                ? "Camera unavailable"
                                : "Initializing"}
                            </span>
                            {" • "}
                            Flags: {violations} • Warnings: {warnings}
                          </p>
                        )}
                        {problemData?.aiGenerated && (
                          <span className="mt-2 inline-flex items-center rounded-md bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-700">
                            AI Interview Scenario
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-semibold ${
                            session?.difficulty?.toLowerCase() === "easy"
                              ? "bg-emerald-100 text-emerald-700"
                              : session?.difficulty?.toLowerCase() === "medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {session?.difficulty
                            ? session.difficulty.slice(0, 1).toUpperCase() +
                              session.difficulty.slice(1)
                            : "Easy"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                            timeLeftSeconds <= 300
                              ? "border-rose-300 bg-rose-100 text-rose-700"
                              : "border-[var(--line)] text-[var(--text-muted)]"
                          }`}
                        >
                          <TimerIcon className="size-4" />
                          {formatTime(timeLeftSeconds)}
                        </span>
                        {isHost && session?.status === "active" && (
                          <button
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-rose-600 px-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-70"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-4 h-4" />
                            )}
                            End Session
                          </button>
                        )}
                        {session?.status === "completed" && (
                          <span className="inline-flex items-center rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm font-semibold text-[var(--text-muted)]">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* problem desc */}
                    {problemData?.description && (
                      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
                        <h2 className="display-font text-xl font-bold mb-4 text-[var(--text-primary)]">Description</h2>
                        <div className="space-y-3 text-base leading-relaxed">
                          <p className="text-[var(--text-body)]">{problemData.description.text}</p>
                          {problemData.description.notes?.map((note, idx) => (
                            <p key={idx} className="text-[var(--text-body)]">
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* examples section */}
                    {problemData?.examples && problemData.examples.length > 0 && (
                      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
                        <h2 className="display-font text-xl font-bold mb-4 text-[var(--text-primary)]">Examples</h2>

                        <div className="space-y-4">
                          {problemData.examples.map((example, idx) => (
                            <div key={idx}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex size-6 items-center justify-center rounded-md bg-[var(--surface-soft-3)] text-xs font-bold text-[var(--text-primary)]">
                                  {idx + 1}
                                </span>
                                <p className="font-semibold text-[var(--text-primary)]">Example {idx + 1}</p>
                              </div>
                              <div className="rounded-lg bg-[var(--surface-soft)] p-4 font-mono text-sm space-y-1.5 text-[var(--text-body)]">
                                <div className="flex gap-2">
                                  <span className="min-w-[70px] font-bold text-[var(--brand-primary)]">
                                    Input:
                                  </span>
                                  <span>{example.input}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="min-w-[70px] font-bold text-[var(--brand-secondary)]">
                                    Output:
                                  </span>
                                  <span>{example.output}</span>
                                </div>
                                {example.explanation && (
                                  <div className="pt-2 border-t border-[var(--line)] mt-2">
                                    <span className="text-[var(--text-muted)] font-sans text-xs">
                                      <span className="font-semibold">Explanation:</span>{" "}
                                      {example.explanation}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints */}
                    {problemData?.constraints && problemData.constraints.length > 0 && (
                      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
                        <h2 className="display-font text-xl font-bold mb-4 text-[var(--text-primary)]">Constraints</h2>
                        <ul className="space-y-2 text-[var(--text-body)]">
                          {problemData.constraints.map((constraint, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-[var(--brand-primary)]">•</span>
                              <code className="text-sm">{constraint}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-[var(--line)] hover:bg-[var(--line-strong)] transition-colors cursor-row-resize" />

              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      disableClipboard={shouldBlockClipboard}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-[var(--line)] hover:bg-[var(--line-strong)] transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} isRunning={isRunning} testsPassed={testsPassed} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-[var(--line)] hover:bg-[var(--line-strong)] transition-colors cursor-col-resize" />

          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-[var(--app-bg-mid)] p-4 overflow-auto">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-[var(--brand-primary)] mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="max-w-md rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 text-center shadow-sm">
                    <div className="items-center text-center">
                      <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-rose-100">
                        <PhoneOffIcon className="w-12 h-12 text-rose-600" />
                      </div>
                      <h2 className="text-2xl font-bold">Connection Failed</h2>
                      <p className="text-[var(--text-muted)]">Unable to connect to the video call</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI
                        chatClient={chatClient}
                        channel={channel}
                        onLeaveSession={handleBottomLeave}
                      />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;


