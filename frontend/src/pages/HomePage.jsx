import { Link } from "react-router";
import {
  ArrowRightIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CheckIcon,
  MessageSquareQuoteIcon,
  Moon,
  SparklesIcon,
  Sun,
  TargetIcon,
  VideoIcon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function HomePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="w-full flex items-center justify-between px-3 py-3 sm:px-5 lg:px-8">
          <Link
            to={"/"}
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-primary)] shadow-md">
              <SparklesIcon className="size-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="display-font text-xl font-bold tracking-wide text-[var(--brand-primary)]">careersprint</span>
              <span className="-mt-1 text-xs font-medium text-[var(--text-muted)]">Interview Prep Hub</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-9 w-16 items-center rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-1 text-[var(--text-soft)] transition hover:bg-[var(--surface-soft-2)]"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              aria-label="Toggle light and dark mode"
            >
              <span
                className={`absolute left-1 top-1 h-7 w-7 rounded-full shadow transition-transform duration-200 ${
                  theme === "light"
                    ? "translate-x-0 bg-white"
                    : "translate-x-7 bg-[var(--surface)] border border-[var(--line)]"
                }`}
              />
              <span className="absolute left-2">
                <Sun className="size-4" />
              </span>
              <span className="absolute right-2">
                <Moon className="size-4" />
              </span>
            </button>
            <Link to="/login">
              <button className="group flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg">
                <span>Get Started</span>
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--brand-primary)] shadow-sm">
            <TargetIcon className="size-4" />
            End-to-end interview preparation platform
          </div>

          <h1 className="display-font text-5xl font-bold leading-tight lg:text-7xl">
            <span className="bg-gradient-to-r from-[var(--brand-top)] via-[var(--brand-primary)] to-[var(--brand-mid)] bg-clip-text text-transparent">
              Practice Better.
            </span>
            <br />
            <span className="text-[var(--text-primary)]">Perform Confidently.</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-[var(--text-soft)]">
            Practice coding, system design, aptitude, and verbal rounds in one place, run live mock
            sessions, and improve with AI feedback plus readiness analytics.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-body)]">
              <CheckIcon className="mr-1 inline size-4 text-[var(--brand-highlight)]" />
              Multi-track problem sets
            </div>
            <div className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-body)]">
              <CheckIcon className="mr-1 inline size-4 text-[var(--brand-highlight)]" />
              Live mock interview rooms
            </div>
            <div className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-body)]">
              <CheckIcon className="mr-1 inline size-4 text-[var(--brand-highlight)]" />
              Profile readiness meter
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/login">
              <button className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[var(--brand-primary-3)]">
                Start Practice
                <ArrowRightIcon className="size-5" />
              </button>
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-[var(--line-strong)] bg-[var(--surface)] px-7 py-3.5 text-base font-semibold text-[var(--brand-primary)] transition hover:bg-[var(--surface-soft-2)]"
            >
              Explore Features
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
            alt="Interview collaboration"
            className="h-72 w-full rounded-3xl object-cover shadow-2xl"
          />
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80"
              alt="Coding interview practice"
              className="h-44 w-full rounded-2xl object-cover shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80"
              alt="Technical interview prep notes"
              className="h-44 w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-10 text-center">
          <h2 className="display-font text-4xl font-bold text-[var(--text-primary)]">
            Everything You Need for Interview Readiness
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-muted)]">
            One workflow for focused practice, live simulation, and measurable progress.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-xl bg-[var(--surface-soft-4)] p-3 text-[var(--brand-primary)]">
              <BookOpenIcon className="size-7" />
            </div>
            <h3 className="display-font text-xl font-semibold text-[var(--text-primary)]">Problem Tracks</h3>
            <p className="mt-2 text-[var(--text-muted)]">
              Solve curated coding, system design, aptitude, and verbal questions with difficulty filters.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-xl bg-[var(--surface-soft-4)] p-3 text-[var(--brand-primary)]">
              <VideoIcon className="size-7" />
            </div>
            <h3 className="display-font text-xl font-semibold text-[var(--text-primary)]">Live Mock Sessions</h3>
            <p className="mt-2 text-[var(--text-muted)]">
              Run realistic 1:1 interview rooms with video, chat, and collaborative problem-solving.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-xl bg-[var(--surface-soft-4)] p-3 text-[var(--brand-primary)]">
              <TargetIcon className="size-7" />
            </div>
            <h3 className="display-font text-xl font-semibold text-[var(--text-primary)]">Progress Analytics</h3>
            <p className="mt-2 text-[var(--text-muted)]">
              Track accuracy, category-wise solved counts, and interview readiness from your profile.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-6 rounded-3xl border border-[var(--line-strong)] bg-[var(--surface)] p-8 shadow-md lg:grid-cols-3">
          <div className="rounded-2xl bg-[var(--surface-soft-2)] p-6">
            <BriefcaseIcon className="size-8 text-[var(--brand-primary)]" />
            <h3 className="display-font mt-3 text-2xl font-semibold text-[var(--text-primary)]">
              AI feedback loops
            </h3>
            <p className="mt-2 text-[var(--text-muted)]">
              Get post-session guidance tailored to coding, system design, aptitude, or verbal rounds.
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--surface-soft-2)] p-6">
            <MessageSquareQuoteIcon className="size-8 text-[var(--brand-primary)]" />
            <h3 className="display-font mt-3 text-2xl font-semibold text-[var(--text-primary)]">
              Secure authentication
            </h3>
            <p className="mt-2 text-[var(--text-muted)]">
              Continue with email/password or Google sign-in and jump straight into interview practice.
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--surface-soft-2)] p-6">
            <SparklesIcon className="size-8 text-[var(--brand-primary)]" />
            <h3 className="display-font mt-3 text-2xl font-semibold text-[var(--text-primary)]">
              Readiness-first workflow
            </h3>
            <p className="mt-2 text-[var(--text-muted)]">
              Build momentum with dashboard tracking, solve streaks, and readiness progression.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;


