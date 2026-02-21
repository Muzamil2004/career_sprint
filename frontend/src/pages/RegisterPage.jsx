import { useState } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, ArrowRight, Loader, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--app-bg-start)] via-[var(--app-bg-mid)] to-[var(--app-bg-end)] px-4 py-12 sm:px-6 lg:px-8">
      <button
        onClick={toggleTheme}
        className="absolute right-5 top-5 z-20 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-[var(--text-soft)] transition hover:bg-[var(--surface-soft-3)]"
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
      </button>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[var(--blob-1)] opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[var(--blob-2)] opacity-30 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="display-font mb-2 text-4xl font-bold text-[var(--text-primary)]">careersprint</h1>
          <p className="text-[var(--text-muted)]">Start your coding journey today</p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="display-font mb-6 text-2xl font-bold text-[var(--text-primary)]">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-[var(--text-body)]">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-[var(--input-icon)]" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--surface-soft)] py-2.5 pl-10 pr-4 text-[var(--text-primary)] placeholder-[var(--input-placeholder)] transition focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--text-body)]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[var(--input-icon)]" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--surface-soft)] py-2.5 pl-10 pr-4 text-[var(--text-primary)] placeholder-[var(--input-placeholder)] transition focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-[var(--text-body)]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[var(--input-icon)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--surface-soft)] py-2.5 pl-10 pr-12 text-[var(--text-primary)] placeholder-[var(--input-placeholder)] transition focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[var(--input-icon)] transition hover:text-[var(--text-muted)]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-[var(--text-subtle)]">At least 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-[var(--text-body)]"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[var(--input-icon)]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--surface-soft)] py-2.5 pl-10 pr-12 text-[var(--text-primary)] placeholder-[var(--input-placeholder)] transition focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-[var(--input-icon)] transition hover:text-[var(--text-muted)]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 cursor-pointer rounded border-[var(--check-border)] bg-[var(--surface)]"
              />
              <label htmlFor="terms" className="text-sm text-[var(--text-muted)]">
                I agree to the{" "}
                <a href="#" className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-3)]">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-3)]">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-2)] py-2.5 font-semibold text-white transition duration-300 hover:from-[var(--brand-primary-4)] hover:to-[var(--brand-primary-5)] disabled:from-slate-500 disabled:to-slate-500"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--line)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[var(--surface)] px-2 text-[var(--text-subtle)]">Already have an account?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-[var(--text-muted)]">
            <Link to="/login" className="font-semibold text-[var(--brand-primary)] transition hover:text-[var(--brand-primary-3)]">
              Sign in instead
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[var(--text-subtle)]">
          We'll never share your email with anyone else.
        </p>
      </div>
    </div>
  );
}


