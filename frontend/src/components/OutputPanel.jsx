function OutputPanel({ output, isRunning, testsPassed, lastRunMode }) {
  return (
    <div className="h-full flex flex-col rounded-lg border border-[var(--line)] bg-[var(--surface)] shadow-sm overflow-hidden">
      <div className="px-4 py-2 bg-[var(--surface-soft)] border-b border-[var(--line)] font-semibold text-sm flex items-center justify-between">
        <span className="text-[var(--text-primary)]">Output</span>
        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="inline-flex items-center rounded-md bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-700">
              Running tests...
            </span>
          )}
          {!isRunning && testsPassed === true && (
            <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
              All tests passed
            </span>
          )}
          {!isRunning && testsPassed === false && (
            <span className="inline-flex items-center rounded-md bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
              Some tests failed
            </span>
          )}
          <span className="text-xs text-[var(--text-muted)]">
            {lastRunMode === "auto" ? "Auto run" : "Manual run"}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {isRunning && output === null ? (
          <p className="text-[var(--text-muted)] text-sm">Running hidden test cases in background...</p>
        ) : output === null ? (
          <p className="text-[var(--text-subtle)] text-sm">
            Start typing. Tests will run automatically in the background.
          </p>
        ) : output.success ? (
          <pre className="text-sm font-mono whitespace-pre-wrap text-emerald-600">{output.output}</pre>
        ) : (
          <div>
            {output.output && (
              <pre className="mb-2 whitespace-pre-wrap text-sm font-mono text-[var(--text-body)]">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono whitespace-pre-wrap text-rose-600">{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;



