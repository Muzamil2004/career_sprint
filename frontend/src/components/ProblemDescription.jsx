import { getDifficultyBadgeClass } from "../lib/utils";
function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  return (
    <div className="h-full overflow-y-auto bg-[var(--app-bg-mid)]">
      {/* HEADER SECTION */}
      <div className="border-b border-[var(--line)] bg-[var(--surface)] p-6">
        <div className="flex items-start justify-between mb-3">
          <h1 className="display-font text-3xl font-bold text-[var(--text-primary)]">{problem.title}</h1>
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${getDifficultyBadgeClass(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className="text-[var(--text-muted)]">{problem.category}</p>

        {/* Problem selector */}
        <div className="mt-4">
          <select
            className="h-9 w-full rounded-md border border-[var(--input-border)] bg-[var(--surface-soft)] px-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* PROBLEM DESC */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
          <h2 className="display-font text-xl font-bold text-[var(--text-primary)]">Description</h2>

          <div className="space-y-3 text-base leading-relaxed">
            <p className="text-[var(--text-body)]">{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="text-[var(--text-body)]">
                {note}
              </p>
            ))}
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
          <h2 className="display-font mb-4 text-xl font-bold text-[var(--text-primary)]">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex size-6 items-center justify-center rounded-md bg-[var(--surface-soft-3)] text-xs font-bold text-[var(--text-primary)]">
                    {idx + 1}
                  </span>
                  <p className="font-semibold text-[var(--text-primary)]">Example {idx + 1}</p>
                </div>
                <div className="rounded-lg bg-[var(--surface-soft)] p-4 font-mono text-sm space-y-1.5 text-[var(--text-body)]">
                  <div className="flex gap-2">
                    <span className="min-w-[70px] font-bold text-[var(--brand-primary)]">Input:</span>
                    <span>{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="min-w-[70px] font-bold text-[var(--brand-secondary)]">Output:</span>
                    <span>{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-[var(--line)] mt-2">
                      <span className="text-[var(--text-muted)] font-sans text-xs">
                        <span className="font-semibold">Explanation:</span> {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
          <h2 className="display-font mb-4 text-xl font-bold text-[var(--text-primary)]">Constraints</h2>
          <ul className="space-y-2 text-[var(--text-body)]">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[var(--brand-primary)]">•</span>
                <code className="text-sm">{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;


