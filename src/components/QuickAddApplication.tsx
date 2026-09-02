import { useState } from "react";
import type { FormEvent } from "react";
import { parseJobUrl } from "../lib/jobUrlParsers";

type Props = {
  onSubmit: (input: { company: string; role: string; link?: string }) => Promise<void> | void;
  isSaving: boolean;
  companySuggestions: string[];
  roleSuggestions: string[];
};

export default function QuickAddApplication({
  onSubmit,
  isSaving,
  companySuggestions,
  roleSuggestions,
}: Props) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [error, setError] = useState("");

  function tryAutofillFromUrl(rawUrl: string) {
    const parsed = parseJobUrl(rawUrl);
    if (!parsed) return;
    if (parsed.company && !company.trim()) setCompany(parsed.company);
    if (parsed.role && !role.trim()) setRole(parsed.role);
    if (parsed.link) setJobUrl(parsed.link);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCompany = company.trim();
    const trimmedRole = role.trim();

    if (!trimmedCompany || !trimmedRole) {
      setError("Company and role are required.");
      return;
    }

    setError("");
    await onSubmit({
      company: trimmedCompany,
      role: trimmedRole,
      link: jobUrl.trim() || undefined,
    });

    setCompany("");
    setRole("");
    setJobUrl("");
  }

  return (
    <div className="jf-card mb-4 p-5">
      <h2 className="text-[14px] font-semibold text-[var(--foreground)]">Quick add</h2>
      <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">
        Paste a job URL and we'll fill in what we can.
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3.5">
          <label className="jf-label" htmlFor="quick-add-url">
            Job URL
          </label>
          <div className="flex gap-2">
            <input
              id="quick-add-url"
              className="jf-input flex-1"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              onBlur={(e) => tryAutofillFromUrl(e.target.value)}
              placeholder="Paste a LinkedIn, PNet or Greenhouse link"
              disabled={isSaving}
            />
            <button
              type="button"
              onClick={() => tryAutofillFromUrl(jobUrl)}
              disabled={isSaving}
              className="shrink-0 rounded-lg border border-[var(--input)] bg-white px-4 py-2.5 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
            >
              Autofill
            </button>
          </div>
        </div>

        <div className="mb-3.5 grid gap-3.5 sm:grid-cols-2">
          <div>
            <label className="jf-label" htmlFor="quick-add-company">
              Company
            </label>
            <input
              id="quick-add-company"
              className="jf-input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              list="company-suggestions"
              placeholder="e.g. Yoco"
              disabled={isSaving}
            />
            <datalist id="company-suggestions">
              {companySuggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="jf-label" htmlFor="quick-add-role">
              Role
            </label>
            <input
              id="quick-add-role"
              className="jf-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              list="role-suggestions"
              placeholder="e.g. Junior Developer"
              disabled={isSaving}
            />
            <datalist id="role-suggestions">
              {roleSuggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
        </div>

        {error && (
          <p role="alert" className="mb-3 text-[13px] text-[var(--destructive)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Add application"}
        </button>
      </form>
    </div>
  );
}
