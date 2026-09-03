import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MailWarning } from "lucide-react";
import { getCurrentUser, resendVerification } from "../api/auth";

/**
 * Shown until the account's email is confirmed. Verification gates alerts
 * rather than sign-in, so this explains what is missing instead of blocking
 * the whole app.
 */
export default function VerifyBanner() {
  const [dismissed, setDismissed] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    staleTime: 60_000,
  });

  const resend = useMutation({
    mutationFn: () => resendVerification(user!.email),
  });

  if (!user || user.is_verified || dismissed) return null;

  return (
    <div className="border-b border-[var(--border)] bg-[var(--warning-soft)]">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-5 py-2.5">
        <MailWarning size={15} className="shrink-0 text-[var(--warning)]" />
        <p className="text-[13px] text-[var(--warning)]">
          Confirm your email to set up job alerts. We sent a link to{" "}
          <strong className="font-semibold">{user.email}</strong>.
        </p>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => resend.mutate()}
            disabled={resend.isPending || resend.isSuccess}
            className="text-[12.5px] font-semibold text-[var(--warning)] underline disabled:no-underline disabled:opacity-70"
          >
            {resend.isSuccess
              ? "Sent — check your inbox"
              : resend.isPending
                ? "Sending…"
                : "Resend link"}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-[12.5px] text-[var(--warning)] opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
