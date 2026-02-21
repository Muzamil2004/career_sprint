import { BrainIcon, Code2Icon, LoaderIcon, PlusIcon, ShieldIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS).filter(
    (problem) => problem.difficulty.toLowerCase() !== "easy"
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 text-[var(--text-primary)] shadow-2xl">
        <h3 className="display-font font-bold text-2xl mb-6">Create Interview Session</h3>

        <div className="space-y-8">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">Problem Source</p>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                className={`rounded-lg border p-4 text-left transition ${
                  roomConfig.selectionMode === "ai_random"
                    ? "border-[var(--brand-primary)] bg-[var(--surface)]"
                    : "border-[var(--line)] bg-[var(--surface-soft)]"
                }`}
                onClick={() =>
                  setRoomConfig((prev) => ({
                    ...prev,
                    selectionMode: "ai_random",
                    problem: "",
                    difficulty: "",
                  }))
                }
              >
                <div className="flex items-center gap-2 font-semibold">
                  <BrainIcon className="size-4" />
                  AI Random Interview
                </div>
                <p className="text-xs mt-1 text-[var(--text-muted)]">
                  Automatically generates an interview-centric scenario problem.
                </p>
              </button>

              <button
                type="button"
                className={`rounded-lg border p-4 text-left transition ${
                  roomConfig.selectionMode === "manual"
                    ? "border-[var(--brand-primary)] bg-[var(--surface)]"
                    : "border-[var(--line)] bg-[var(--surface-soft)]"
                }`}
                onClick={() =>
                  setRoomConfig((prev) => ({
                    ...prev,
                    selectionMode: "manual",
                  }))
                }
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Code2Icon className="size-4" />
                  Manual Interview Bank
                </div>
                <p className="text-xs mt-1 text-[var(--text-muted)]">
                  Pick from curated medium/hard coding interview problems.
                </p>
              </button>
            </div>
          </div>

          {roomConfig.selectionMode === "ai_random" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-primary)]">
                  Interview Focus
                </label>
                <select
                  className="mt-2 w-full rounded-lg border border-[var(--input-border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
                  value={roomConfig.focus}
                  onChange={(e) =>
                    setRoomConfig((prev) => ({
                      ...prev,
                      focus: e.target.value,
                    }))
                  }
                >
                  <option value="situational">Situational (Recommended)</option>
                  <option value="system-design-lite">System Design Lite</option>
                  <option value="algorithms">Algorithms</option>
                </select>
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
            </div>
          )}

          {roomConfig.selectionMode === "manual" && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text-primary)]">
              Select Problem <span className="text-red-500">*</span>
            </label>

            <select
              className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                if (!selectedProblem) return;
                setRoomConfig((prev) => ({
                  ...prev,
                  difficulty: selectedProblem.difficulty.toLowerCase(),
                  problem: e.target.value,
                }));
              }}
            >
              <option value="" disabled>
                Choose a medium/hard interview problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>
          )}

          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <ShieldIcon className="size-5" />
            <div>
              <p className="font-semibold">Interview Mode</p>
              <p>Full-screen enforced during session and clipboard actions are blocked.</p>
            </div>
          </div>

          {(roomConfig.selectionMode === "ai_random" || roomConfig.problem) && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              <BrainIcon className="size-5" />
              <div>
                <p className="font-semibold">Session Summary:</p>
                <p>
                  Problem Source:{" "}
                  <span className="font-medium">
                    {roomConfig.selectionMode === "ai_random"
                      ? "AI-generated random interview scenario"
                      : roomConfig.problem}
                  </span>
                </p>
                <p>
                  Focus: <span className="font-medium">{roomConfig.focus}</span>
                </p>
                <p>
                  Max Participants:{" "}
                  <span className="font-medium">2 (1-on-1 interview simulation)</span>
                </p>
              </div>
            </div>
          )}
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
            disabled={isCreating || (roomConfig.selectionMode === "manual" && !roomConfig.problem)}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

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


