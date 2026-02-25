import { BrainIcon, Code2Icon, LoaderIcon, PlusIcon, ShieldIcon } from "lucide-react";

const INTERVIEW_TYPE_META = {
  coding: {
    title: "AI Coding Interview",
    description: "AI generates DSA-style coding interview problems.",
    icon: BrainIcon,
  },
  "system-design": {
    title: "AI System Design Interview",
    description: "Practice architecture and trade-off interview questions.",
    icon: Code2Icon,
  },
  aptitude: {
    title: "AI Aptitude Interview",
    description: "Solve quantitative aptitude and logical reasoning questions.",
    icon: BrainIcon,
  },
  verbal: {
    title: "AI Verbal Interview",
    description: "Improve grammar, comprehension, and communication responses.",
    icon: BrainIcon,
  },
};

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 text-[var(--text-primary)] shadow-2xl">
        <h3 className="display-font mb-6 text-2xl font-bold">Create Interview Session</h3>

        <div className="space-y-8">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
            <p className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Interview Type</p>
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(INTERVIEW_TYPE_META).map(([focus, meta]) => {
                const Icon = meta.icon;
                const isSelected = roomConfig.focus === focus;
                return (
                  <button
                    key={focus}
                    type="button"
                    className={`rounded-lg border p-4 text-left transition ${
                      isSelected
                        ? "border-[var(--brand-primary)] bg-[var(--surface)]"
                        : "border-[var(--line)] bg-[var(--surface-soft)]"
                    }`}
                    onClick={() =>
                      setRoomConfig((prev) => ({
                        ...prev,
                        selectionMode: "ai_random",
                        focus,
                      }))
                    }
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Icon className="size-4" />
                      {meta.title}
                    </div>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{meta.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text-primary)]">
              Minimum Difficulty
            </label>
            <select
              className="mt-2 w-full rounded-lg border border-[var(--input-border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
              value={roomConfig.minDifficulty}
              onChange={(e) =>
                setRoomConfig((prev) => ({
                  ...prev,
                  minDifficulty: e.target.value,
                }))
              }
            >
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <ShieldIcon className="size-5" />
            <div>
              <p className="font-semibold">Interview Mode</p>
              <p>Full-screen enforced during session and clipboard actions are blocked.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
            <BrainIcon className="size-5" />
            <div>
              <p className="font-semibold">Session Summary:</p>
              <p>
                Interview Type:{" "}
                <span className="font-medium">{INTERVIEW_TYPE_META[roomConfig.focus]?.title}</span>
              </p>
              <p>
                Difficulty Floor: <span className="font-medium">{roomConfig.minDifficulty}</span>
              </p>
              <p>
                Max Participants:{" "}
                <span className="font-medium">2 (1-on-1 interview simulation)</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            className="inline-flex h-10 items-center rounded-lg border border-[var(--line)] px-4 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-soft)]"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-3)] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onCreateRoom}
            disabled={isCreating}
          >
            {isCreating ? <LoaderIcon className="size-5 animate-spin" /> : <PlusIcon className="size-5" />}
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
      <button
        className="absolute inset-0 -z-10 cursor-default"
        onClick={onClose}
        aria-label="Close modal backdrop"
      />
    </div>
  );
}

export default CreateSessionModal;
