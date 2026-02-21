import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm hover:border-[var(--line-strong)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-2)] p-2">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="display-font text-2xl font-bold text-[var(--text-primary)]">Your Past Sessions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <Loader className="w-10 h-10 animate-spin text-[var(--brand-primary)]" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className={`relative rounded-2xl border ${
                  session.status === "active"
                    ? "bg-emerald-100/40 border-emerald-300 hover:border-emerald-500"
                    : "bg-[var(--surface-soft)] border-[var(--line)] hover:border-[var(--line-strong)]"
                }`}
              >
                {session.status === "active" && (
                  <div className="absolute top-3 right-3">
                    <div className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ACTIVE
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        session.status === "active"
                          ? "bg-gradient-to-br from-success to-success/70"
                          : "bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-2)]"
                      }`}
                    >
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base mb-1 truncate">{session.problem}</h3>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${
                          session.difficulty?.toLowerCase() === "easy"
                            ? "bg-emerald-100 text-emerald-700"
                            : session.difficulty?.toLowerCase() === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm opacity-80 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {session.participant ? "2" : "1"} participant
                        {session.participant ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[var(--line)] pt-3">
                    <span className="text-xs font-semibold opacity-80 uppercase">Completed</span>
                    <span className="text-xs opacity-40">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                <Trophy className="w-10 h-10 text-accent/50" />
              </div>
              <p className="text-lg font-semibold opacity-70 mb-1">No sessions yet</p>
              <p className="text-sm opacity-50">Start your coding journey today!</p>
            </div>
          )}
        </div>
    </div>
  );
}

export default RecentSessions;


