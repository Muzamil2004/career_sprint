import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2Icon, SparklesIcon, TargetIcon, TrophyIcon } from "lucide-react";

function SessionSummaryPopupPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = window.sessionStorage.getItem("session-summary-popup");
    if (!raw) return;
    try {
      setData(JSON.parse(raw));
    } catch {
      setData(null);
    }
  }, []);

  if (!data?.summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--app-bg-start)] via-[var(--app-bg-mid)] to-[var(--app-bg-end)] p-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 text-center">
          <h1 className="display-font text-2xl font-bold text-[var(--text-primary)]">No Summary Found</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Start and end a session to view summary popup content.
          </p>
        </div>
      </div>
    );
  }

  const summary = data.summary;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--app-bg-start)] via-[var(--app-bg-mid)] to-[var(--app-bg-end)] p-6">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
            <TrophyIcon className="size-6" />
          </div>
          <div>
            <h2 className="display-font text-2xl font-bold text-[var(--text-primary)]">
              Mock Session Summary
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              {data.problem ? `${data.problem} • ` : ""}Session completed.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Problems Solved
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{summary.problemsSolved}</p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Accuracy
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{summary.accuracy}%</p>
            <p className="mt-1 text-xs text-[var(--text-subtle)]">
              {summary.successfulRuns}/{summary.attempts} successful runs
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Interview Readiness
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
              {summary.interviewReadiness}%
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-[var(--surface-soft)] p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-2 font-semibold text-[var(--text-primary)]">
              <TargetIcon className="size-4 text-[var(--brand-primary)]" />
              Readiness Meter
            </span>
            <span className="font-semibold text-[var(--brand-primary)]">{summary.interviewReadiness}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[var(--line)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-emerald-500"
              style={{ width: `${summary.interviewReadiness}%` }}
            />
          </div>
        </div>

        {summary.proctoring && (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Integrity Score
              </p>
              <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                {summary.proctoring.integrityScore}%
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Proctoring Flags
              </p>
              <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                {summary.proctoring.violations}
              </p>
              <p className="mt-1 text-xs text-[var(--text-subtle)]">
                Warnings: {summary.proctoring.warnings}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Risk Level
              </p>
              <p className="mt-2 text-2xl font-bold text-[var(--text-primary)] capitalize">
                {summary.proctoring.riskLevel}
              </p>
              <p className="mt-1 text-xs text-[var(--text-subtle)]">
                Away: {summary.proctoring.totalAwaySeconds}s
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] p-4">
          <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <SparklesIcon className="size-4 text-[var(--brand-primary)]" />
            ChatGPT Tips
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-body)]">
            {data.tips || "No tips available."}
          </pre>
        </div>

        <div className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] p-4">
          <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <TargetIcon className="size-4 text-[var(--brand-secondary)]" />
            Detailed Problem Analysis
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-body)]">
            {data.analysis || "No analysis available."}
          </pre>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-3)]"
          >
            <CheckCircle2Icon className="size-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionSummaryPopupPage;
