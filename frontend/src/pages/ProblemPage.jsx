import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const normalizeOutput = (output) => {
  // normalize output for comparison (trim whitespace, handle different spacing)
  return output
    .trim()
    .split("\n")
    .map((line) =>
      line
        .trim()
        // remove spaces after [ and before ]
        .replace(/\[\s+/g, "[")
        .replace(/\s+\]/g, "]")
        // normalize spaces around commas to single space after comma
        .replace(/\s*,\s*/g, ",")
    )
    .filter((line) => line.length > 0)
    .join("\n");
};

const checkIfTestsPassed = (actualOutput, expectedOutput) => {
  const normalizedActual = normalizeOutput(actualOutput);
  const normalizedExpected = normalizeOutput(expectedOutput);

  return normalizedActual == normalizedExpected;
};

const SOLVED_PROBLEMS_STORAGE_KEY = "solved-problem-ids";

const markProblemAsSolved = (problemId) => {
  if (!problemId || typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(SOLVED_PROBLEMS_STORAGE_KEY);
    const solvedIds = raw ? JSON.parse(raw) : [];
    const nextIds = Array.isArray(solvedIds) ? solvedIds : [];

    if (!nextIds.includes(problemId)) {
      nextIds.push(problemId);
      localStorage.setItem(SOLVED_PROBLEMS_STORAGE_KEY, JSON.stringify(nextIds));
    }
  } catch {
    // Ignore storage issues so solving flow is not blocked.
  }
};

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testsPassed, setTestsPassed] = useState(null);
  const [lastRunMode, setLastRunMode] = useState("manual");
  const runRequestIdRef = useRef(0);

  const currentProblem = PROBLEMS[currentProblemId];

  // update problem when URL param changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
      setTestsPassed(null);
    }
  }, [id, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
    setTestsPassed(null);
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  }, []);

  const runTests = useCallback(async ({ mode = "manual", showFeedback = false } = {}) => {
    const requestId = ++runRequestIdRef.current;
    setLastRunMode(mode);
    setIsRunning(true);
    if (mode === "manual") {
      setOutput(null);
    }

    const result = await executeCode(selectedLanguage, code);
    if (requestId !== runRequestIdRef.current) {
      return;
    }

    setOutput(result);
    setIsRunning(false);

    // check if code executed successfully and matches expected output
    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);
      setTestsPassed(testsPassed);

      if (testsPassed) {
        markProblemAsSolved(currentProblem.id);
        if (showFeedback) {
          triggerConfetti();
          toast.success("All tests passed! Great job!");
        }
      } else {
        if (showFeedback) {
          toast.error("Tests failed. Check your output!");
        }
      }
    } else {
      setTestsPassed(false);
      if (showFeedback) {
        toast.error("Code execution failed!");
      }
    }
  }, [code, currentProblem, selectedLanguage, triggerConfetti]);

  const handleRunCode = () => runTests({ mode: "manual", showFeedback: true });

  useEffect(() => {
    if (!code?.trim()) return;

    const debounceTimer = setTimeout(() => {
      runTests({ mode: "auto", showFeedback: false });
    }, 1200);

    return () => clearTimeout(debounceTimer);
  }, [code, currentProblemId, runTests]);

  return (
    <div className="h-screen bg-gradient-to-br from-[var(--app-bg-start)] via-[var(--app-bg-mid)] to-[var(--app-bg-end)] flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-[var(--line)] hover:bg-[var(--line-strong)] transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-[var(--line)] hover:bg-[var(--line-strong)] transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}

              <Panel defaultSize={30} minSize={30}>
                <OutputPanel
                  output={output}
                  isRunning={isRunning}
                  testsPassed={testsPassed}
                  lastRunMode={lastRunMode}
                />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;

