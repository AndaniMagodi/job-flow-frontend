import { useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { forgotPassword } from "../api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
    } finally {
      // Always show the same confirmation. Reporting a failure here would
      // reveal whether the address has an account.
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="jf-card p-6">
          {sent ? (
            <div className="text-center">
              <MailCheck size={28} className="mx-auto text-[var(--success)]" />
              <h1 className="mt-4 text-[18px] font-semibold text-[var(--foreground)]">
                Check your email
              </h1>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--muted-foreground)]">
                If that email has an account, a reset link is on its way. It
                works for one hour.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-[19px] font-semibold text-[var(--foreground)]">
                Reset your password
              </h1>
              <p className="mt-1 text-[14px] text-[var(--muted-foreground)]">
                We'll email you a link to set a new one.
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>
            </>
          )}

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
