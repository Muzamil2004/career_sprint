import { useMemo } from "react";
import Navbar from "../components/Navbar";
import { useMyRecentSessions } from "../hooks/useSessions";
import { useAuth } from "../context/AuthContext";

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

  const { accuracy, problemsSolved, solvedStreakDays, solvedSessions } = useMemo(() => {
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
      totalAttempts > 0 ? Math.round((totalSuccessfulRuns / totalAttempts) * 100) : 0;

    return {
      accuracy: calculatedAccuracy,
      problemsSolved: totalProblemsSolved,
      solvedStreakDays: streak,
      solvedSessions: sessions.length,
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
                  className="relative h-20 w-20 rounded-full"
                  style={{
                    background: `conic-gradient(var(--brand-primary) ${accuracy}%, var(--surface-soft-3) 0)`,
                  }}
                >
                  <div className="absolute inset-2 flex items-center justify-center rounded-full bg-[var(--surface)] text-sm font-bold text-[var(--text-primary)]">
                    {accuracy}%
                  </div>
                </div>
                <p className="text-sm text-[var(--text-muted)]">Based on your recent solved attempts.</p>
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
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
