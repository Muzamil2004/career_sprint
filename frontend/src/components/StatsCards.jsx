import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="lg:col-span-1 grid grid-cols-1 gap-6">
      {/* Active Count */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm hover:border-[var(--line-strong)]">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-2xl bg-[var(--surface-soft-3)] p-3">
              <UsersIcon className="h-7 w-7 text-[var(--brand-primary)]" />
            </div>
            <div className="inline-flex items-center rounded-md bg-[var(--brand-primary)] px-2 py-1 text-xs font-semibold text-white">
              Live
            </div>
          </div>
          <div className="display-font mb-1 text-4xl font-bold text-[var(--text-primary)]">{activeSessionsCount}</div>
          <div className="text-sm text-[var(--text-muted)]">Active Sessions</div>
      </div>

      {/* Recent Count */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm hover:border-[var(--line-strong)]">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-2xl bg-[var(--surface-soft-3)] p-3">
              <TrophyIcon className="h-7 w-7 text-[var(--brand-primary)]" />
            </div>
          </div>
          <div className="display-font mb-1 text-4xl font-bold text-[var(--text-primary)]">{recentSessionsCount}</div>
          <div className="text-sm text-[var(--text-muted)]">Total Sessions</div>
      </div>
    </div>
  );
}

export default StatsCards;


