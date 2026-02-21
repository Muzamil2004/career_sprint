import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function WelcomeSection({ onCreateSession }) {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col gap-6 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-2)]">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="display-font bg-gradient-to-r from-[var(--brand-top)] via-[var(--brand-primary)] to-[var(--brand-mid)] bg-clip-text text-4xl font-bold text-transparent lg:text-5xl">
                Welcome back, {user?.name?.split(" ")[0] || "there"}!
              </h1>
            </div>
            <p className="ml-16 text-lg text-[var(--text-muted)]">
              Run realistic, interview-style coding simulations with live collaboration.
            </p>
          </div>
          <button
            onClick={onCreateSession}
            className="group rounded-2xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-2)] px-8 py-4 transition-all duration-200 hover:opacity-90"
          >
            <div className="flex items-center gap-3 text-lg font-bold text-white">
              <ZapIcon className="w-6 h-6" />
              <span>Start Mock Interview</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;


