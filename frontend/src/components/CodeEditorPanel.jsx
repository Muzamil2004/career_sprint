import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  disableClipboard = false,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  const handleEditorDidMount = (editor) => {
    if (!disableClipboard) return;

    const node = editor.getDomNode();
    if (!node) return;

    const preventClipboard = (event) => event.preventDefault();
    node.addEventListener("copy", preventClipboard);
    node.addEventListener("cut", preventClipboard);
    node.addEventListener("paste", preventClipboard);

    editor.onDidDispose(() => {
      node.removeEventListener("copy", preventClipboard);
      node.removeEventListener("cut", preventClipboard);
      node.removeEventListener("paste", preventClipboard);
    });
  };

  return (
    <div className="h-full flex flex-col rounded-lg border border-[var(--line)] bg-[var(--surface)] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-soft)] px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-6"
          />
          <select
            className="h-8 rounded-md border border-[var(--input-border)] bg-[var(--surface)] px-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
            value={selectedLanguage}
            onChange={onLanguageChange}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="inline-flex h-8 items-center gap-2 rounded-md bg-[var(--brand-primary)] px-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-3)] disabled:opacity-70"
          disabled={isRunning}
          onClick={onRunCode}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="size-4" />
              Run Code
            </>
          )}
        </button>
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            contextmenu: !disableClipboard,
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;


