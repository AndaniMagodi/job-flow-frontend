import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { getAIStatus, matchCVToJob } from "../api/ai";
import type { JobMatchResult } from "../types/job";

const CV_STORAGE_KEY = "jobflow.cv";
const MIN_CV_LENGTH = 50;

/** Reading storage throws in some privacy modes, so never let it break render. */
function readStoredCV(): string {
  try {
    return localStorage.getItem(CV_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function storeCV(text: string) {
  try {
    localStorage.setItem(CV_STORAGE_KEY, text);
  } catch {
    /* not worth surfacing — the match still works this session */
  }
}

export default function CVMatchPanel({ jobId }: { jobId: number }) {
  const [cvText, setCvText] = useState(readStoredCV);
  const [expanded, setExpanded] = useState(false);

  const { data: aiStatus } = useQuery({
    queryKey: ["ai-status"],
    queryFn: getAIStatus,
    staleTime: Infinity,
  });

  const match = useMutation({
    mutationFn: () => matchCVToJob(jobId, cvText),
    onSuccess: () => storeCV(cvText),
  });

  const tooShort = cvText.trim().length < MIN_CV_LENGTH;

  // Offering the panel with no model configured just leads to a 503.
  if (aiStatus && !aiStatus.available) return null;

  return (
    <section className="jf-card overflow-hidden">
      <header className="flex items-start gap-3 border-b border-[var(--border)] bg-[var(--primary-soft)] px-5 py-4">
        <Sparkles size={17} className="mt-0.5 shrink-0 text-[var(--primary)]" />
        <div>
          <h2 className="text-[14.5px] font-semibold text-[var(--accent-foreground)]">
            How well do you fit this role?
          </h2>
          <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--accent-foreground)] opacity-80">
            Paste your CV and get an honest read on your strengths and gaps for
            this specific job.
          </p>
        </div>
      </header>

      <div className="p-5">
        {!match.data && (
          <>
            <label className="jf-label" htmlFor="cv-text">
              Your CV
            </label>
            <textarea
              id="cv-text"
              className="jf-input min-h-32 resize-y font-[inherit] leading-relaxed"
              placeholder="Paste the text of your CV here — summary, skills, and work history."
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              rows={8}
            />
            <p className="mt-2 text-[12.5px] text-[var(--muted-foreground)]">
              Kept in this browser and sent only when you ask for a match.
            </p>

            <button
              onClick={() => match.mutate()}
              disabled={tooShort || match.isPending}
              className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {match.isPending && <Loader2 size={15} className="animate-spin" />}
              {match.isPending ? "Analysing…" : "Check my fit"}
            </button>

            {tooShort && cvText.length > 0 && (
              <p className="mt-2 text-[12.5px] text-[var(--muted-foreground)]">
                Add a bit more — at least {MIN_CV_LENGTH} characters.
              </p>
            )}
          </>
        )}

        {match.isError && (
          <p className="mt-3 rounded-lg bg-[var(--destructive-soft)] px-3.5 py-3 text-[13px] text-[var(--destructive)]">
            {(match.error as Error).message}
          </p>
        )}

        {match.data && (
          <MatchResult
            result={match.data}
            onRedo={() => {
              match.reset();
              setExpanded(false);
            }}
            expanded={expanded}
            onToggleExpanded={() => setExpanded((v) => !v)}
          />
        )}
      </div>
    </section>
  );
}

function MatchResult({
  result,
  onRedo,
  expanded,
  onToggleExpanded,
}: {
  result: JobMatchResult;
  onRedo: () => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  const tone = scoreTone(result.match_score);

  return (
    <div>
      <div className="flex items-center gap-4">
        <ScoreRing score={result.match_score} color={tone.color} />
        <div className="min-w-0">
          <p className="text-[15px] font-semibold" style={{ color: tone.color }}>
            {result.verdict}
          </p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--muted-foreground)]">
            {result.summary}
          </p>
        </div>
      </div>

      {expanded && (
        <div className="mt-5 space-y-4">
          <PointList
            title="What works in your favour"
            items={result.strengths}
            icon={<CheckCircle2 size={14} className="text-[var(--success)]" />}
          />
          <PointList
            title="Gaps to be aware of"
            items={result.gaps}
            icon={<AlertCircle size={14} className="text-[var(--warning)]" />}
          />
          <PointList
            title="What to do next"
            items={result.suggestions}
            icon={<Lightbulb size={14} className="text-[var(--primary)]" />}
          />
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={onToggleExpanded}
          className="rounded-lg border border-[var(--input)] bg-white px-3.5 py-2 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
        >
          {expanded ? "Hide detail" : "See the detail"}
        </button>
        <button
          onClick={onRedo}
          className="text-[13px] font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          Use a different CV
        </button>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-[var(--muted-foreground)]">
        AI-generated and not a hiring decision. It reads your CV against this
        listing only — treat it as a prompt to think, not a verdict.
      </p>
    </div>
  );
}

function PointList({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-[13px] font-semibold text-[var(--foreground)]">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-[var(--muted-foreground)]">
            <span className="mt-0.5 shrink-0">{icon}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function scoreTone(score: number): { color: string } {
  if (score >= 75) return { color: "var(--success)" };
  if (score >= 50) return { color: "var(--primary)" };
  if (score >= 30) return { color: "var(--warning)" };
  return { color: "var(--destructive)" };
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      className="shrink-0"
      role="img"
      aria-label={`Match score ${score} out of 100`}
    >
      <circle cx="32" cy="32" r={radius} fill="none" stroke="var(--muted)" strokeWidth="5" />
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 32 32)"
      />
      <text
        x="32"
        y="32"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="17"
        fontWeight="600"
        fill={color}
      >
        {score}
      </text>
    </svg>
  );
}
