import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { verifyEmail } from "../api/auth";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";

  // Driven by react-query rather than an effect: the token is single-use, so
  // it must be redeemed exactly once. Query caching keyed on the token also
  // survives React's double mount in development, which would otherwise burn
  // the token on the first render and report failure on the second.
  const { status, error } = useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmail(token),
    enabled: token.length > 0,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const failed = !token || status === "error";
  const message = !token
    ? "That link is missing its token."
    : ((error as Error | null)?.message ?? "");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-4 py-10">
      <div className="jf-card w-full max-w-sm p-8 text-center">
        {token && status === "pending" && (
          <>
            <Loader2
              size={26}
              className="mx-auto animate-spin text-[var(--muted-foreground)]"
            />
            <p className="mt-4 text-[14.5px] text-[var(--muted-foreground)]">
              Confirming your email…
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 size={30} className="mx-auto text-[var(--success)]" />
            <h1 className="mt-4 text-[19px] font-semibold text-[var(--foreground)]">
              Email confirmed
            </h1>
            <p className="mt-1.5 text-[14px] text-[var(--muted-foreground)]">
              You can now set up job alerts.
            </p>
            <Link
              to="/jobs"
              className="mt-5 inline-block rounded-lg bg-[var(--primary)] px-5 py-2.5 text-[13.5px] font-semibold text-white no-underline"
            >
              Find jobs
            </Link>
          </>
        )}

        {failed && (
          <>
            <XCircle size={30} className="mx-auto text-[var(--destructive)]" />
            <h1 className="mt-4 text-[19px] fontefont-semibold text-[var(--foreground)]">
              That link didn't work
            </h1>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--muted-foreground)]">
              {message}
            </p>
            <Link
              to="/jobs"
              className="mt-5 inline-block rounded-lg border border-[var(--input)] bg-white px-5 py-2.5 text-[13.5px] font-medium text-[var(--foreground)] no-underline"
            >
              Back to jobs
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
