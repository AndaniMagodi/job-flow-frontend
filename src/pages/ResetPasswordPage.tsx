import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth";

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const mismatch = confirm.length > 0 && password !== confirm;
  const canSubmit =
    password.length >= MIN_PASSWORD_LENGTH && password === confirm && !!token;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    setLoading(true);
    try {
      const { access_token } = await resetPassword(token, password);
      // Reset proves control of the mailbox, so sign them straight in.
      localStorage.setItem("token", access_token);
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
        <div className="jf-card p-6">
          <h1 className="text-[19px] font-semibold text-[var(--foreground)]">
            Choose a new password
          </h1>
          <p className="mt-1 text-[14px] text-[var(--muted-foreground)]">
            At least {MIN_PASSWORD_LENGTH} characters.
          </p>

          {!token && (
            <p role="alert" className="mt-4 rounded-lg bg-[var(--destructive-soft)] px-3.5 py-2.5 text-[13px] text-[var(--destructive)]">
              That link is missing its token. Request a new reset email.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            <div>
              <label className="jf-label" htmlFor="password">
                New password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="jf-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {tooShort && (
                <p className="mt-1.5 text-[12.5px] text-[var(--muted-foreground)]">
                  A bit longer — {MIN_PASSWORD_LENGTH} characters minimum.
                </p>
              )}
            </div>

            <div>
              <label className="jf-label" htmlFor="confirm">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                className="jf-input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              {mismatch && (
                <p className="mt-1.5 text-[12.5px] text-[var(--destructive)]">
                  Those don't match.
                </p>
              )}
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-[var(--destructive-soft)] px-3.5 py-2.5 text-[13px] text-[var(--destructive)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {loading ? "Saving…" : "Set new password"}
            </button>
          </form>

          <p className="mt-5 text-center text-[13px] text-[var(--muted-foreground)]">
            <Link to="/login" className="font-medium text-[var(--primary)] no-underline hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
