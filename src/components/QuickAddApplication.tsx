import { useState } from "react";
import type { FormEvent } from "react";
import { parseJobUrl } from "../lib/jobUrlParsers";

type Props = {
  onSubmit: (input: {
    company: string;
    role: string;
    link?: string;
  }) => Promise<void> | void;
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

  function resetFields() {
    setCompany("");
    setRole("");
    setJobUrl("");
  }

  function tryAutofillFromUrl(rawUrl: string) {
    const parsed = parseJobUrl(rawUrl);
    if (!parsed) {
      return;
    }

    if (parsed.company && !company.trim()) {
      setCompany(parsed.company);
    }

    if (parsed.role && !role.trim()) {
      setRole(parsed.role);
    }

    if (parsed.link) {
      setJobUrl(parsed.link);
    }
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
    resetFields();
  }

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-lg font-semibold">Quick Add</h3>
        <p className="text-sm text-slate-600">
          Add a new application in seconds. Status and date are auto-filled.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-[1fr_1fr]">
        <div className="md:col-span-2">
          <label htmlFor="jobUrl" className="mb-1 block text-sm font-medium text-slate-700">
            Job URL (optional)
          </label>
          <div className="flex gap-2">
            <input
              id="jobUrl"
              value={jobUrl}
              onChange={(event) => setJobUrl(event.target.value)}
              onBlur={(event) => tryAutofillFromUrl(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="Paste LinkedIn, Greenhouse, or Lever link"
              disabled={isSaving}
            />
            <button
              type="button"
              onClick={() => tryAutofillFromUrl(jobUrl)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSaving}
            >
              Autofill
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="company" className="mb-1 block text-sm font-medium text-slate-700">
            Company
          </label>
          <input
            id="company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            list="company-suggestions"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="e.g. Electrum"
            disabled={isSaving}
          />
          <datalist id="company-suggestions">
            {companySuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700">
            Role
          </label>
          <input
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            list="role-suggestions"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="e.g. Junior Developer"
            disabled={isSaving}
          />
          <datalist id="role-suggestions">
            {roleSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="h-10 rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Add"}
          </button>
        </div>
      </form>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
}
