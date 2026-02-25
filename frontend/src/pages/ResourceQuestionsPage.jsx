import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router";
import { BookOpenCheckIcon, ChevronRightIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import { RESOURCE_QUESTIONS } from "../data/resourceQuestions";

function ResourceQuestionsPage() {
  const { topic } = useParams();

  const topicData = useMemo(() => {
    if (!topic) return null;
    return RESOURCE_QUESTIONS[topic] || null;
  }, [topic]);

  if (!topicData) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--app-bg-start)] via-[var(--app-bg-mid)] to-[var(--app-bg-end)]">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <h1 className="display-font mb-2 text-4xl font-bold text-[var(--text-primary)]">{topicData.title}</h1>
          <p className="text-[var(--text-muted)]">{topicData.subtitle}</p>
        </div>

        <div className="space-y-4">
          {topicData.questions.map((question, index) => (
            <div
              key={`${topic}-${index}`}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-soft-3)]">
                    <BookOpenCheckIcon className="size-5 text-[var(--brand-primary)]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                      Question {index + 1}
                    </p>
                    <p className="mt-1 text-[var(--text-primary)]">{question}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--line-strong)]"
          >
            Back to Resources
            <ChevronRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResourceQuestionsPage;
