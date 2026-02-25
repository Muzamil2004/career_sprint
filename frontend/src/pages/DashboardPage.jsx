import { useNavigate } from "react-router";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problems";
import {
  BookOpenIcon,
  BrainCircuitIcon,
  FlameIcon,
  PlusIcon,
  SparklesIcon,
  TargetIcon,
  TimerIcon,
  VideoIcon,
  ArrowRightIcon,
} from "lucide-react";
import CreateSessionModal from "../components/CreateSessionModal";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({
    selectionMode: "ai_random",
    focus: "coding",
    minDifficulty: "medium",
    enforceFullscreen: true,
    blockClipboard: true,
  });

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const handleCreateRoom = () => {
    createSessionMutation.mutate(
      {
        selectionMode: roomConfig.selectionMode,
        focus: roomConfig.focus,
        minDifficulty: roomConfig.minDifficulty,
        enforceFullscreen: roomConfig.enforceFullscreen,
        blockClipboard: roomConfig.blockClipboard,
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];
  const previewRecent = recentSessions.slice(0, 2);
  const previewLive = activeSessions.slice(0, 2);
  const currentUserId = user?._id || user?.id;
  const profileCompletion = Math.min(
    95,
    45 + Math.min(recentSessions.length, 4) * 10 + (user?.email ? 10 : 0)
  );
  const allProblems = Object.values(PROBLEMS);
  const solvedProblemIds = (() => {
    if (typeof window === "undefined") return [];
    try {
      const storedSolvedProblemIds = localStorage.getItem("solved-problem-ids");
      const parsedIds = storedSolvedProblemIds ? JSON.parse(storedSolvedProblemIds) : [];
      return Array.isArray(parsedIds) ? parsedIds : [];
    } catch {
      return [];
    }
  })();
  const solvedProblemIdsSet = new Set(solvedProblemIds);
  const totalPracticeProblems = allProblems.length;
  const solvedPracticeProblems = allProblems.filter((problem) => solvedProblemIdsSet.has(problem.id)).length;
  const practiceProgress = totalPracticeProblems
    ? Math.min(100, Math.round((solvedPracticeProblems / totalPracticeProblems) * 100))
    : 0;
  const categoryProgressData = [
    {
      key: "aptitude",
      label: "Aptitude",
      total: allProblems.filter((problem) => problem.category.toLowerCase().includes("aptitude")).length,
      solved: allProblems.filter(
        (problem) =>
          problem.category.toLowerCase().includes("aptitude") && solvedProblemIdsSet.has(problem.id)
      ).length,
    },
    {
      key: "system-design",
      label: "System Design",
      total: allProblems.filter((problem) => problem.category.toLowerCase().includes("system design")).length,
      solved: allProblems.filter(
        (problem) =>
          problem.category.toLowerCase().includes("system design") && solvedProblemIdsSet.has(problem.id)
      ).length,
    },
    {
      key: "verbal",
      label: "Verbal",
      total: allProblems.filter((problem) => problem.category.toLowerCase().includes("verbal")).length,
      solved: allProblems.filter(
        (problem) => problem.category.toLowerCase().includes("verbal") && solvedProblemIdsSet.has(problem.id)
      ).length,
    },
  ].map((item) => ({
    ...item,
    progress: item.total ? Math.min(100, Math.round((item.solved / item.total) * 100)) : 0,
  }));

  const isUserInSession = (session) => {
    if (!currentUserId) return false;

    return session.host?._id === currentUserId || session.participant?._id === currentUserId;
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-[var(--app-bg-start)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="float-slow absolute -top-16 -left-16 h-72 w-72 rounded-full bg-[var(--blob-1)]/30 blur-3xl" />
          <div className="float-slow absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-[var(--blob-2)]/30 blur-3xl [animation-delay:1.2s]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_40%)]" />
        </div>

        <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <section className="glass-panel fade-up p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)]/70 px-3 py-1 text-xs font-semibold text-[var(--brand-primary)]">
                  <SparklesIcon className="size-3.5" />
                  Interview Command Center
                </div>
                <h1 className="display-font text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-5xl">
                  Welcome back, {user?.name?.split(" ")[0] || "Candidate"}
                </h1>
                <p className="mt-2 max-w-2xl text-[var(--text-muted)]">
                  Stay in rhythm with live interview sessions, focused practice, and progress tracking.
                </p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-2)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02]"
                onClick={() => setShowCreateModal(true)}
              >
                <PlusIcon className="size-4" />
                New Session
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/80 p-4">
                <div className="mb-3 inline-flex rounded-lg bg-[var(--surface-soft-3)] p-2 text-[var(--brand-primary)]">
                  <FlameIcon className="size-4" />
                </div>
                <p className="display-font text-3xl font-bold text-[var(--text-primary)]">{activeSessions.length}</p>
                <p className="text-sm text-[var(--text-muted)]">Live sessions now</p>
              </div>
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/80 p-4">
                <div className="mb-3 inline-flex rounded-lg bg-[var(--surface-soft-3)] p-2 text-[var(--brand-primary)]">
                  <TimerIcon className="size-4" />
                </div>
                <p className="display-font text-3xl font-bold text-[var(--text-primary)]">{recentSessions.length}</p>
                <p className="text-sm text-[var(--text-muted)]">Total sessions completed</p>
              </div>
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/80 p-4">
                <div className="mb-3 inline-flex rounded-lg bg-[var(--surface-soft-3)] p-2 text-[var(--brand-primary)]">
                  <TargetIcon className="size-4" />
                </div>
                <p className="display-font text-3xl font-bold text-[var(--text-primary)]">{profileCompletion}%</p>
                <p className="text-sm text-[var(--text-muted)]">Interview readiness</p>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="glass-panel p-6 lg:col-span-7">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="display-font text-2xl font-bold text-[var(--text-primary)]">Live Sessions</h2>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {activeSessions.length} active
                </span>
              </div>
              <div className="space-y-3">
                {loadingActiveSessions ? (
                  <p className="text-sm text-[var(--text-muted)]">Loading live sessions...</p>
                ) : previewLive.length > 0 ? (
                  previewLive.map((session) => {
                    const canJoin = !session.participant || isUserInSession(session);
                    return (
                      <div key={session._id} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/75 p-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="text-lg font-bold text-[var(--text-primary)]">{session.problem}</p>
                          <span className="rounded-md bg-[var(--surface-soft-3)] px-2 py-1 text-xs font-semibold text-[var(--brand-primary)]">
                            {session.participant ? "Starting soon" : "Open slot"}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">Hosted by {session.host?.name}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-xs text-[var(--text-subtle)]">Difficulty: {session.difficulty}</p>
                          <button
                            className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--brand-primary-3)] disabled:cursor-not-allowed disabled:bg-slate-500"
                            disabled={!canJoin}
                            onClick={() => navigate(`/session/${session._id}`)}
                          >
                            {isUserInSession(session) ? "Rejoin" : "Join"}
                            <ArrowRightIcon className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/65 p-4 text-sm text-[var(--text-muted)]">
                    No live sessions right now.
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel p-6 lg:col-span-5">
              <h2 className="display-font text-2xl font-bold text-[var(--text-primary)]">Progress</h2>
              <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)]/75 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Practice problems</p>
                  <p className="text-xs font-semibold text-[var(--text-muted)]">
                    {solvedPracticeProblems}/{totalPracticeProblems}
                  </p>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--surface-soft-3)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-2)] transition-all"
                    style={{ width: `${practiceProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)]">{practiceProgress}% complete</p>
              </div>

              <div className="mt-4 space-y-3">
                {categoryProgressData.map((category) => (
                  <div
                    key={category.key}
                    className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/75 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{category.label}</p>
                      <p className="text-xs font-semibold text-[var(--text-muted)]">
                        {category.solved}/{category.total}
                      </p>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-soft-3)]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                        style={{ width: `${category.progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-[var(--text-muted)]">{category.progress}%</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="glass-panel p-6 lg:col-span-7">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="display-font text-2xl font-bold text-[var(--text-primary)]">Recent Sessions</h2>
                <span className="text-xs font-semibold text-[var(--text-muted)]">Latest 2</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {loadingRecentSessions ? (
                  <p className="text-sm text-[var(--text-muted)]">Loading sessions...</p>
                ) : previewRecent.length > 0 ? (
                  previewRecent.map((session) => (
                    <div key={session._id} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/75 p-4">
                      <p className="text-lg font-bold text-[var(--text-primary)]">{session.problem}</p>
                      <p className="mt-2 text-xs text-[var(--text-muted)]">
                        {new Date(session.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-2 text-xs text-[var(--text-subtle)]">Difficulty: {session.difficulty}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/65 p-4 text-sm text-[var(--text-muted)]">
                    No completed sessions yet. Start a mock interview to build history.
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel p-6 lg:col-span-5">
              <h2 className="display-font text-2xl font-bold text-[var(--text-primary)]">Resources</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <button
                  onClick={() => navigate("/problems")}
                  className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface)]/80 p-3 text-left transition hover:border-[var(--line-strong)]"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                    <BookOpenIcon className="size-4 text-[var(--brand-primary)]" />
                    Coding Questions
                  </span>
                  <ArrowRightIcon className="size-4 text-[var(--text-subtle)]" />
                </button>
                <button
                  onClick={() => navigate("/resources/system-design")}
                  className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface)]/80 p-3 text-left transition hover:border-[var(--line-strong)]"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                    <BookOpenIcon className="size-4 text-[var(--brand-primary)]" />
                    System Design Questions
                  </span>
                  <ArrowRightIcon className="size-4 text-[var(--text-subtle)]" />
                </button>
                <button
                  onClick={() => navigate("/resources/aptitude")}
                  className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface)]/80 p-3 text-left transition hover:border-[var(--line-strong)]"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                    <BookOpenIcon className="size-4 text-[var(--brand-primary)]" />
                    Aptitude Questions
                  </span>
                  <ArrowRightIcon className="size-4 text-[var(--text-subtle)]" />
                </button>
                <button
                  onClick={() => navigate("/resources/verbal")}
                  className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface)]/80 p-3 text-left transition hover:border-[var(--line-strong)]"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                    <BookOpenIcon className="size-4 text-[var(--brand-primary)]" />
                    Verbal Questions
                  </span>
                  <ArrowRightIcon className="size-4 text-[var(--text-subtle)]" />
                </button>
                <button
                  onClick={() => navigate("/ai-feedback")}
                  className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface)]/80 p-3 text-left transition hover:border-[var(--line-strong)]"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                    <BrainCircuitIcon className="size-4 text-[var(--brand-primary)]" />
                    AI Feedback
                  </span>
                  <ArrowRightIcon className="size-4 text-[var(--text-subtle)]" />
                </button>
                <button className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface)]/80 p-3 text-left transition hover:border-[var(--line-strong)]">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                    <VideoIcon className="size-4 text-[var(--brand-primary)]" />
                    Video Tips
                  </span>
                  <ArrowRightIcon className="size-4 text-[var(--text-subtle)]" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;

