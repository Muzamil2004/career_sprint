import { Link } from "react-router";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CheckIcon,
  Code2Icon,
  MessageSquareQuoteIcon,
  Moon,
  SparklesIcon,
  Sun,
  TargetIcon,
  UsersIcon,
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
            Smart interview preparation platform
          </div>

          <h1 className="display-font text-5xl font-bold leading-tight lg:text-7xl">
            <span className="bg-gradient-to-r from-[var(--brand-top)] via-[var(--brand-primary)] to-[var(--brand-mid)] bg-clip-text text-transparent">
              Practice Better.
            </span>
            <br />
            <span className="text-[var(--text-primary)]">Perform Confidently.</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-[var(--text-soft)]">
            Collaborate in live coding rooms, simulate real interviews, and improve with structured
            practice sessions and guided feedback loops.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-body)]">
              <CheckIcon className="mr-1 inline size-4 text-[var(--brand-highlight)]" />
              Live Pair Coding
            </div>
            <div className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-body)]">
              <CheckIcon className="mr-1 inline size-4 text-[var(--brand-highlight)]" />
              Video + Editor
            </div>
            <div className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-body)]">
              <CheckIcon className="mr-1 inline size-4 text-[var(--brand-highlight)]" />
              Multi-language execution
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/login">
              <button className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[var(--brand-primary-3)]">
                Start Session
                <ArrowRightIcon className="size-5" />
              </button>
            </Link>
            <button className="rounded-xl border border-[var(--line-strong)] bg-[var(--surface)] px-7 py-3.5 text-base font-semibold text-[var(--brand-primary)] transition hover:bg-[var(--surface-soft-2)]">
              Explore Features
            </button>
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

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-10 text-center">
          <h2 className="display-font text-4xl font-bold text-[var(--text-primary)]">
            Everything for Interview Readiness
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-muted)]">
            Focus on practicing, communicating, and solving under pressure with one consistent
            workflow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-xl bg-[var(--surface-soft-4)] p-3 text-[var(--brand-primary)]">
              <VideoIcon className="size-7" />
            </div>
            <h3 className="display-font text-xl font-semibold text-[var(--text-primary)]">Interview Rooms</h3>
            <p className="mt-2 text-[var(--text-muted)]">
              Create or join live sessions with structured prompts and real-time collaboration.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-xl bg-[var(--surface-soft-4)] p-3 text-[var(--brand-primary)]">
              <Code2Icon className="size-7" />
            </div>
            <h3 className="display-font text-xl font-semibold text-[var(--text-primary)]">Shared Coding</h3>
            <p className="mt-2 text-[var(--text-muted)]">
              Work in a synchronized editor and test solutions instantly with language support.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-xl bg-[var(--surface-soft-4)] p-3 text-[var(--brand-primary)]">
              <UsersIcon className="size-7" />
            </div>
            <h3 className="display-font text-xl font-semibold text-[var(--text-primary)]">Peer Feedback</h3>
            <p className="mt-2 text-[var(--text-muted)]">
              Improve communication and problem-solving through collaborative review.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-6 rounded-3xl border border-[var(--line-strong)] bg-[var(--surface)] p-8 shadow-md lg:grid-cols-3">
          <div className="rounded-2xl bg-[var(--surface-soft-2)] p-6">
            <BriefcaseIcon className="size-8 text-[var(--brand-primary)]" />
            <h3 className="display-font mt-3 text-2xl font-semibold text-[var(--text-primary)]">
              Company-style rounds
            </h3>
            <p className="mt-2 text-[var(--text-muted)]">
              Practice with realistic session formats and time pressure.
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--surface-soft-2)] p-6">
            <MessageSquareQuoteIcon className="size-8 text-[var(--brand-primary)]" />
            <h3 className="display-font mt-3 text-2xl font-semibold text-[var(--text-primary)]">
              Communication focus
            </h3>
            <p className="mt-2 text-[var(--text-muted)]">
              Sharpen explanation quality while solving technical tasks.
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--surface-soft-2)] p-6">
            <SparklesIcon className="size-8 text-[var(--brand-primary)]" />
            <h3 className="display-font mt-3 text-2xl font-semibold text-[var(--text-primary)]">
              Progress-ready workflow
            </h3>
            <p className="mt-2 text-[var(--text-muted)]">
              Track practice rhythm with active and recent session history.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;


