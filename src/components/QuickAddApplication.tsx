import { useState } from "react";
import type { FormEvent } from "react";
import { parseJobUrl } from "../lib/jobUrlParsers";

type Props = {
  onSubmit: (input: { company: string; role: string; link?: string; }) => Promise<void> | void;
  isSaving: boolean;
  companySuggestions: string[];
  roleSuggestions: string[];
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#222",
  border: "1px solid #2a2a2a",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 13,
  color: "#ddd",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  color: "#555",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: 6,
};

export default function QuickAddApplication({ onSubmit, isSaving, companySuggestions, roleSuggestions }: Props) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [error, setError] = useState("");

  function resetFields() {
    setCompany(""); setRole(""); setJobUrl("");
  }

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
    await onSubmit({ company: trimmedCompany, role: trimmedRole, link: jobUrl.trim() || undefined });
    resetFields();
  }

  return (
    <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 16, padding: 16 }}>
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, letterSpacing: "-0.2px" }}>
          Quick add
        </h3>
        <p style={{ fontSize: 11, color: "#555", marginTop: 3 }}>
          Paste a job URL and we'll fill in the details.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Job URL</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={jobUrl}
              onChange={e => setJobUrl(e.target.value)}
              onBlur={e => tryAutofillFromUrl(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Paste LinkedIn, PNet, or Greenhouse link"
              disabled={isSaving}
            />
            <button
              type="button"
              onClick={() => tryAutofillFromUrl(jobUrl)}
              disabled={isSaving}
              style={{ background: "#222", color: "#888", fontSize: 12, fontWeight: 500, padding: "10px 14px", borderRadius: 10, border: "1px solid #2a2a2a", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              Autofill
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Company</label>
            <input
              value={company}
              onChange={e => setCompany(e.target.value)}
              list="company-suggestions"
              style={inputStyle}
              placeholder="e.g. Electrum"
              disabled={isSaving}
            />
            <datalist id="company-suggestions">
              {companySuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          </div>
          <div>
            <label style={labelStyle}>Role</label>
            <input
              value={role}
              onChange={e => setRole(e.target.value)}
              list="role-suggestions"
              style={inputStyle}
              placeholder="e.g. Junior Developer"
              disabled={isSaving}
            />
            <datalist id="role-suggestions">
              {roleSuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          </div>
        </div>

        {error && (
          <p style={{ fontSize: 11, color: "#f87171", marginBottom: 10 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          style={{ background: "#6366f1", color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 20, border: "none", cursor: "pointer", opacity: isSaving ? 0.6 : 1 }}
        >
          {isSaving ? "Saving..." : "Add application"}
        </button>
      </form>
    </div>
  );
}