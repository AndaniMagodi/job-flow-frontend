import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(email, password);
      navigate("/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-7 flex items-center justify-center gap-2.5">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--primary)] text-[16px] font-bold text-white"
          >
            J
          </span>
          <span className="text-[19px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
            JobFlow
          </span>
        </div>

        <div className="jf-card p-6">
          <h1 className="text-[19px] font-semibold tracking-[-0.01em] text-[var(--foreground)]">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-[14px] text-[var(--muted-foreground)]">
            {mode === "login"
              ? "Sign in to find and track jobs across South Africa."
              : "Find jobs across South Africa and keep every application in one place."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            <div>
              <label className="jf-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="jf-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label className="jf-label" htmlFor="password">
                  Password
                </label>
                {mode === "login" && (
                  <Link
                    to="/forgot-password"
                    className="mb-1.5 text-[12.5px] font-medium text-[var(--primary)] no-underline hover:underline"
                  >
                    Forgot?
                  </Link>
                )}
              </div>
              <input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="jf-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-[var(--destructive-soft)] px-3.5 py-2.5 text-[13px] text-[var(--destructive)]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-[13px] text-[var(--muted-foreground)]">
            {mode === "login" ? "Don't have an account? " : "Already have one? "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="font-medium text-[var(--primary)] hover:underline"
            >
              {mode === "login" ? "Register" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-[13px] text-[var(--muted-foreground)]">
          Find the role. Track the application. Miss nothing.
        </p>
      </div>
    </div>
  );
}
