import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--surface)] shadow-sm">
      <div className="w-full flex items-center justify-between px-3 py-3 sm:px-5 lg:px-8">
        {/* LOGO */}
        <Link
          to="/"
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

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            onClick={toggleTheme}
            className="relative inline-flex h-9 w-16 items-center rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-1 transition-colors duration-200 hover:bg-[var(--surface-soft-2)]"
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
            <span className="absolute left-2 text-[var(--text-soft)]">
              <Sun className="size-4" />
            </span>
            <span className="absolute right-2 text-[var(--text-soft)]">
              <Moon className="size-4" />
            </span>
          </button>

          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`rounded-lg px-3 py-2.5 transition-all duration-200 sm:px-4
              ${
                isActive("/problems")
                  ? "bg-[var(--brand-primary)] text-white"
                  : "text-[var(--text-soft)] hover:bg-[var(--surface-soft-3)] hover:text-[var(--text-primary)]"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Problems</span>
            </div>
          </Link>

          {/* DASHBORD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`rounded-lg px-3 py-2.5 transition-all duration-200 sm:px-4
              ${
                isActive("/dashboard")
                  ? "bg-[var(--brand-primary)] text-white"
                  : "text-[var(--text-soft)] hover:bg-[var(--surface-soft-3)] hover:text-[var(--text-primary)]"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Dashbord</span>
            </div>
          </Link>

          {/* User Profile and Logout */}
          <div className="ml-4 flex items-center gap-3">
            {user && (
              <>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{user.name}</span>
                  <span className="text-xs text-[var(--text-muted)]">{user.email}</span>
                </div>
                <Link
                  to="/profile"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary)] font-bold text-white"
                  title="Profile"
                >
                  {user.name.charAt(0).toUpperCase()}
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-2 transition-colors duration-200 hover:bg-[var(--surface-soft-3)]"
                  title="Logout"
                >
                  <LogOut className="size-5 text-[var(--text-soft)] hover:text-[var(--text-primary)]" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;


