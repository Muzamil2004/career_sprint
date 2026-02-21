import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, Loader, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error("Google credential missing");
      return;
    }

    setIsLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast.success("Login successful with Google!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Google Sign-In
  const initGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleSuccess,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "dark", size: "large" }
      );
    }
  };

  // Initialize Google Sign-In on component mount
  useEffect(() => {
    initGoogleSignIn();
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--app-bg-start)] via-[var(--app-bg-mid)] to-[var(--app-bg-end)] px-4 sm:px-6 lg:px-8">
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
          <p className="text-[var(--text-muted)]">Welcome back to your learning journey</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="display-font mb-6 text-2xl font-bold text-[var(--text-primary)]">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--surface-soft)] py-2.5 pl-10 pr-4 text-[var(--text-primary)] placeholder-[var(--input-placeholder)] transition focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20"
                />
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-[var(--check-border)] bg-[var(--surface)]"
                />
                <span className="text-sm text-[var(--text-muted)]">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[var(--brand-primary)] transition hover:text-[var(--brand-primary-3)]">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-2)] py-2.5 font-semibold text-white transition duration-300 hover:from-[var(--brand-primary-4)] hover:to-[var(--brand-primary-5)] disabled:from-slate-500 disabled:to-slate-500"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
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
              <span className="bg-[var(--surface)] px-2 text-[var(--text-subtle)]">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <div id="google-signin-button" className="flex justify-center mb-6"></div>

          {/* New to careersprint */}
          <div className="relative my-4">
            <div className="text-center text-sm">
              <span className="text-[var(--text-muted)]">New to careersprint?</span>
            </div>
          </div>
          <p className="text-center text-[var(--text-muted)]">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-[var(--brand-primary)] transition hover:text-[var(--brand-primary-3)]">
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[var(--text-subtle)]">
          By signing in, you agree to our{" "}
          <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-body)]">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-body)]">
            Privacy Policy
          </a>
        </p>
      </div>

      <style>{`
        #google-signin-button iframe {
          border-radius: 0.75rem;
        }
      `}</style>
    </div>
  );
}


