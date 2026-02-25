import { Link, useSearchParams } from "react-router";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDifficulty = searchParams.get("difficulty") || "all";
  const activeCategory = searchParams.get("category") || "all";
  const problems = Object.values(PROBLEMS);
  const filteredByCategory =
    activeCategory === "all"
      ? problems
      : problems.filter((p) => p.category.toLowerCase().includes(activeCategory));
  const filteredProblems =
    activeDifficulty === "all"
      ? filteredByCategory
      : filteredByCategory.filter((p) => p.difficulty.toLowerCase() === activeDifficulty);
  const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
  const indexedProblems = [...filteredProblems].sort((a, b) => {
    const difficultyDelta = (difficultyOrder[a.difficulty] || 99) - (difficultyOrder[b.difficulty] || 99);
    if (difficultyDelta !== 0) return difficultyDelta;
    return a.title.localeCompare(b.title);
  });

  const easyProblemsCount = filteredByCategory.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = filteredByCategory.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = filteredByCategory.filter((p) => p.difficulty === "Hard").length;

  const setDifficulty = (difficulty) => {
    const nextParams = new URLSearchParams(searchParams);
    if (difficulty === "all") nextParams.delete("difficulty");
    else nextParams.set("difficulty", difficulty);
    setSearchParams(nextParams);
  };

  const setCategory = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category === "all") nextParams.delete("category");
    else nextParams.set("category", category);
    setSearchParams(nextParams);
  };

  const categoryHeader = {
    all: {
      title: "Coding Questions",
      subtitle: "Sharpen your interview prep with coding, system design, aptitude, and verbal questions.",
    },
    "system design": {
      title: "System Design Questions",
      subtitle: "Practice architecture, scalability, and trade-off thinking for real-world systems.",
    },
    aptitude: {
      title: "Aptitude Questions",
      subtitle: "Build speed and accuracy in quantitative reasoning and analytical problem-solving.",
    },
    verbal: {
      title: "Verbal Questions",
      subtitle: "Improve grammar, vocabulary, and critical reasoning for interview communication rounds.",
    },
  };
  const { title, subtitle } = categoryHeader[activeCategory] || categoryHeader.all;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--app-bg-start)] via-[var(--app-bg-mid)] to-[var(--app-bg-end)]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="display-font mb-2 text-4xl font-bold text-[var(--text-primary)]">{title}</h1>
          <p className="text-[var(--text-muted)]">{subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { value: "all", label: "All Categories" },
              { value: "system design", label: "System Design" },
              { value: "aptitude", label: "Aptitude" },
              { value: "verbal", label: "Verbal" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setCategory(item.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === item.value
                    ? "bg-[var(--brand-primary)] text-white"
                    : "border border-[var(--line)] bg-[var(--surface)] text-[var(--text-body)] hover:border-[var(--line-strong)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { value: "all", label: "All" },
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setDifficulty(item.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeDifficulty === item.value
                    ? "bg-[var(--brand-primary)] text-white"
                    : "border border-[var(--line)] bg-[var(--surface)] text-[var(--text-body)] hover:border-[var(--line-strong)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-4">
          {indexedProblems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="block rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm transition-transform hover:scale-[1.01] hover:border-[var(--line-strong)]"
            >
                <div className="flex items-center justify-between gap-4">
                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">{problem.title}</h2>
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${getDifficultyBadgeClass(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-muted)]"> {problem.category}</p>
                    </div>
                    <p className="mb-3 text-[var(--text-body)]">{problem.description.text}</p>
                  </div>
                  {/* RIGHT SIDE */}

                  <div className="flex items-center gap-2 text-[var(--brand-primary)]">
                    <span className="font-medium">Solve</span>
                    <ChevronRightIcon className="size-5" />
                  </div>
                </div>
            </Link>
          ))}
          {indexedProblems.length === 0 && (
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 text-sm text-[var(--text-muted)]">
              No questions found for this category and difficulty.
            </div>
          )}
        </div>

        {/* STATS FOOTER */}
        <div className="mt-12 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <div className="text-sm text-[var(--text-muted)]">Total Problems</div>
                <div className="text-3xl font-bold text-[var(--brand-primary)]">{filteredByCategory.length}</div>
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <div className="text-sm text-[var(--text-muted)]">Easy</div>
                <div className="text-3xl font-bold text-emerald-600">{easyProblemsCount}</div>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <div className="text-sm text-[var(--text-muted)]">Medium</div>
                <div className="text-3xl font-bold text-amber-600">{mediumProblemsCount}</div>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <div className="text-sm text-[var(--text-muted)]">Hard</div>
                <div className="text-3xl font-bold text-rose-600">{hardProblemsCount}</div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;


