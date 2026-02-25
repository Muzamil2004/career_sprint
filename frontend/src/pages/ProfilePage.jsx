import { useMemo } from "react";
import Navbar from "../components/Navbar";
import { useMyRecentSessions } from "../hooks/useSessions";
import { useAuth } from "../context/AuthContext";
import { PROBLEMS } from "../data/problems";

function toDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ProfilePage() {
  const { user } = useAuth();
  const { data } = useMyRecentSessions();

  const {
    accuracy,
    problemsSolved,
    solvedStreakDays,
    solvedSessions,
    codingSolved,
    aptitudeSolved,
    verbalSolved,
    readiness,
  } = useMemo(() => {
    const sessions = data?.sessions || [];

    let totalAttempts = 0;
    let totalSuccessfulRuns = 0;
    let totalProblemsSolved = 0;
    const solvedDayKeys = new Set();

    sessions.forEach((session) => {
      const summary = session?.interviewSummary || {};
      totalAttempts += summary.attempts || 0;
      totalSuccessfulRuns += summary.successfulRuns || 0;
      totalProblemsSolved += summary.problemsSolved || 0;

      if ((summary.problemsSolved || 0) > 0) {
        const dateKey = toDateKey(summary.generatedAt || session.updatedAt || session.createdAt);
        if (dateKey) solvedDayKeys.add(dateKey);
      }
    });

    let streak = 0;
    const current = new Date();
    current.setHours(0, 0, 0, 0);

    while (solvedDayKeys.has(toDateKey(current))) {
      streak += 1;
      current.setDate(current.getDate() - 1);
    }

    const calculatedAccuracy =
      totalProblemsSolved > 0 && totalAttempts > 0
        ? Math.round((totalSuccessfulRuns / totalAttempts) * 100)
        : 0;

    const allProblems = Object.values(PROBLEMS);
    const codingProblemIds = new Set(
      allProblems
        .filter(
          (problem) =>
            !problem.category.toLowerCase().includes("aptitude") &&
            !problem.category.toLowerCase().includes("verbal")
        )
        .map((problem) => problem.id)
    );
    const aptitudeProblemIds = new Set(
      allProblems
        .filter((problem) => problem.category.toLowerCase().includes("aptitude"))
        .map((problem) => problem.id)
    );
    const verbalProblemIds = new Set(
      allProblems
        .filter((problem) => problem.category.toLowerCase().includes("verbal"))
        .map((problem) => problem.id)
    );

    let solvedProblemIds = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("solved-problem-ids");
        const parsed = raw ? JSON.parse(raw) : [];
        solvedProblemIds = Array.isArray(parsed) ? parsed : [];
      } catch {
        solvedProblemIds = [];
      }
    }

    const solvedIdsSet = new Set(solvedProblemIds);
    const solvedCodingCount = [...codingProblemIds].filter((id) => solvedIdsSet.has(id)).length;
    const solvedAptitudeCount = [...aptitudeProblemIds].filter((id) => solvedIdsSet.has(id)).length;
    const solvedVerbalCount = [...verbalProblemIds].filter((id) => solvedIdsSet.has(id)).length;

    const solvedTrackableCount = solvedCodingCount + solvedAptitudeCount + solvedVerbalCount;
    const totalTrackableCount =
      codingProblemIds.size + aptitudeProblemIds.size + verbalProblemIds.size;
    const solvedCoverage = totalTrackableCount
      ? Math.round((solvedTrackableCount / totalTrackableCount) * 100)
      : 0;
    const streakScore = Math.min(100, Math.round((streak / 14) * 100));
    const interviewReadiness = Math.round(
      calculatedAccuracy * 0.6 + solvedCoverage * 0.3 + streakScore * 0.1
    );

    return {
      accuracy: calculatedAccuracy,
      problemsSolved: totalProblemsSolved,
      solvedStreakDays: streak,
      solvedSessions: sessions.length,
      codingSolved: solvedCodingCount,
      aptitudeSolved: solvedAptitudeCount,
      verbalSolved: solvedVerbalCount,
      readiness: interviewReadiness,
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-[var(--app-bg-start)]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand-primary)] text-3xl font-bold text-white">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="display-font text-3xl font-bold text-[var(--text-primary)]">
                {user?.name || "User Profile"}
              </h1>
              <p className="mt-1 text-[var(--text-muted)]">{user?.email || "No email on file"}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Account Status
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">Active</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Member Since
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Accuracy
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div
                  className="size-20 shrink-0 rounded-full border border-[var(--line)]"
                  style={{
                    background: `conic-gradient(var(--brand-primary) ${accuracy}%, var(--surface-soft-3) 0)`,
                  }}
                />
                <div>
                  <p className="text-xl font-bold text-[var(--text-primary)]">{accuracy}%</p>
                  <div className="mt-2 space-y-1 text-xs text-[var(--text-muted)]">
                    <p className="flex items-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--brand-primary)]" />
                      Correct runs
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--surface-soft-3)]" />
                      Remaining
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Problems Solved
              </p>
              <p className="mt-3 display-font text-3xl font-bold text-[var(--text-primary)]">
                {problemsSolved}
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Across {solvedSessions} completed sessions</p>
            </div>

            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Solve Streak
              </p>
              <p className="mt-3 display-font text-3xl font-bold text-[var(--text-primary)]">
                {solvedStreakDays} {solvedStreakDays === 1 ? "day" : "days"}
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Consecutive days with at least one solved problem
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Interview Readiness
              </p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{readiness}%</p>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-soft-3)]">
              <div
                className="h-full rounded-full bg-[var(--brand-primary)] transition-all"
                style={{ width: `${readiness}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Based on accuracy, solved coverage, and current streak.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Coding Solved
              </p>
              <p className="mt-2 display-font text-3xl font-bold text-[var(--text-primary)]">
                {codingSolved}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Aptitude Solved
              </p>
              <p className="mt-2 display-font text-3xl font-bold text-[var(--text-primary)]">
                {aptitudeSolved}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Verbal Solved
              </p>
              <p className="mt-2 display-font text-3xl font-bold text-[var(--text-primary)]">
                {verbalSolved}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
