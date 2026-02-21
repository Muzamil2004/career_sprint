import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="h-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm hover:border-[var(--line-strong)] lg:col-span-2">
        {/* HEADERS SECTION */}
        <div className="flex items-center justify-between mb-6">
          {/* TITLE AND ICON */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-2)] p-2 text-white">
              <ZapIcon className="size-5" />
            </div>
            <h2 className="display-font text-2xl font-bold text-[var(--text-primary)]">Live Sessions</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-emerald-600">{sessions.length} active</span>
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoaderIcon className="size-10 animate-spin text-[var(--brand-primary)]" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)] hover:border-[var(--line-strong)]"
              >
                <div className="flex items-center justify-between gap-4 p-5">
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-2)]">
                      <Code2Icon className="size-7 text-white" />
                      <div className="absolute -right-1 -top-1 size-4 rounded-full border-2 border-white bg-emerald-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="truncate text-lg font-bold text-[var(--text-primary)]">{session.problem}</h3>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${
                            session.difficulty?.toLowerCase() === "easy"
                              ? "bg-emerald-100 text-emerald-700"
                              : session.difficulty?.toLowerCase() === "medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {session.difficulty.slice(0, 1).toUpperCase() +
                            session.difficulty.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm opacity-80">
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="size-4" />
                          <span className="font-medium">{session.host?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="size-4" />
                          <span className="text-xs">{session.participant ? "2/2" : "1/2"}</span>
                        </div>
                        {session.participant && !isUserInSession(session) ? (
                          <span className="inline-flex items-center rounded-md bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">FULL</span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">OPEN</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {session.participant && !isUserInSession(session) ? (
                    <button className="inline-flex h-9 items-center rounded-lg bg-slate-400 px-4 text-sm font-semibold text-white" disabled>
                      Full
                    </button>
                  ) : (
                    <Link
                      to={`/session/${session._id}`}
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-3)]"
                    >
                      {isUserInSession(session) ? "Rejoin" : "Join"}
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                <SparklesIcon className="w-10 h-10 text-[var(--brand-primary)]/50" />
              </div>
              <p className="text-lg font-semibold opacity-70 mb-1">No active sessions</p>
              <p className="text-sm opacity-50">Be the first to create one!</p>
            </div>
          )}
        </div>
    </div>
  );
}
export default ActiveSessions;


