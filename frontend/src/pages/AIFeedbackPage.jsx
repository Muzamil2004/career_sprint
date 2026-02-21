import { useState } from "react";
import { BotIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import { aiApi } from "../api/ai";
import toast from "react-hot-toast";

function AIFeedbackPage() {
  const [prompt, setPrompt] = useState("");
  const [problem, setProblem] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error("Please enter your feedback request.");
      return;
    }

    setIsLoading(true);
    setFeedback("");
    try {
      const result = await aiApi.getFeedback({
        prompt: prompt.trim(),
        problem: problem.trim(),
        language,
        code: code.trim(),
      });
      setFeedback(result.feedback || "No feedback returned.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get AI feedback");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--app-bg-start)] via-[var(--app-bg-mid)] to-[var(--app-bg-end)]">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6">
          <h1 className="display-font text-4xl font-bold text-[var(--text-primary)]">AI Feedback</h1>
          <p className="mt-2 text-[var(--text-muted)]">
            Get interview-style feedback powered by ChatGPT on your approach and code.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-body)]">
                  What feedback do you want?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="Example: Review my approach and suggest improvements for time/space complexity."
                  className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--surface-soft)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-body)]">
                  Problem (optional)
                </label>
                <input
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Two Sum"
                  className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--surface-soft)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-body)]">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--surface-soft)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-body)]">
                  Your code (optional)
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={8}
                  placeholder="Paste your solution here..."
                  className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--surface-soft)] p-3 font-mono text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-3)] disabled:opacity-70"
            >
              {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : <SparklesIcon className="size-4" />}
              {isLoading ? "Generating feedback..." : "Get AI Feedback"}
            </button>
          </form>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--surface-soft-3)] px-3 py-1 text-xs font-semibold text-[var(--brand-primary)]">
              <BotIcon className="size-3.5" />
              ChatGPT feedback
            </div>

            {feedback ? (
              <pre className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-body)]">{feedback}</pre>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                Submit your request to receive structured strengths, issues, improvements, and readiness score.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIFeedbackPage;
