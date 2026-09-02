import { useState } from "react";
import { Loader2, Search, Sparkles, X } from "lucide-react";
import type { SearchFilters } from "../types/job";

type Props = {
  /** Plain keyword search — always available. */
  onSearch: (query: string) => void;
  /** AI search — only offered when the backend reports a configured model. */
  onSmartSearch: (query: string) => void;
  aiAvailable: boolean;
  aiPending: boolean;
  /** What the model understood, shown so the user can correct it. */
  interpretation?: SearchFilters | null;
  onClearInterpretation: () => void;
  initialQuery?: string;
};

const EXAMPLES = [
  "junior python developer in Cape Town",
  "remote roles paying over R50k a month",
  "entry level healthcare jobs in KZN",
];

export default function SmartSearchBar({
  onSearch,
  onSmartSearch,
  aiAvailable,
  aiPending,
  interpretation,
  onClearInterpretation,
  initialQuery = "",
}: Props) {
  const [query, setQuery] = useState(initialQuery);

  const trimmed = query.trim();

  return (
    <div className="jf-card p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (trimmed) onSearch(trimmed);
        }}
        className="flex flex-col gap-2.5 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
          />
          <input
            className="jf-input pl-10"
            placeholder={
              aiAvailable
                ? "Search jobs, or describe what you're looking for"
                : "Search by job title or company"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search jobs"
          />
        </div>

        <div className="flex gap-2.5">
          <button
            type="submit"
            disabled={!trimmed}
            className="flex-1 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 sm:flex-none"
          >
            Search
          </button>

          {aiAvailable && (
            <button
              type="button"
              onClick={() => trimmed && onSmartSearch(trimmed)}
              disabled={!trimmed || aiPending}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--input)] bg-white px-4 py-2.5 text-[13.5px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:opacity-40 sm:flex-none"
            >
              {aiPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Sparkles size={15} className="text-[var(--primary)]" />
              )}
              Ask AI
            </button>
          )}
        </div>
      </form>

      {aiAvailable && !interpretation && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-[12.5px] text-[var(--muted-foreground)]">Try:</span>
          {EXAMPLES.map((example) => (
            <button
              key={example}
              onClick={() => {
                setQuery(example);
                onSmartSearch(example);
              }}
              className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[12.5px] text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              {example}
            </button>
          ))}
        </div>
      )}

      {interpretation && (
        <div className="mt-3.5 flex items-start gap-2.5 rounded-lg bg-[var(--primary-soft)] px-3.5 py-3">
          <Sparkles size={15} className="mt-0.5 shrink-0 text-[var(--primary)]" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-relaxed text-[var(--accent-foreground)]">
              {interpretation.interpretation}
            </p>
            <ActiveFilterChips filters={interpretation} />
          </div>
          <button
            onClick={onClearInterpretation}
            className="shrink-0 rounded p-1 text-[var(--accent-foreground)] opacity-60 hover:opacity-100"
            aria-label="Clear AI search"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function ActiveFilterChips({ filters }: { filters: SearchFilters }) {
  const chips: string[] = [];

  if (filters.keywords) chips.push(filters.keywords);
  if (filters.province) chips.push(filters.province);
  if (filters.category) chips.push(filters.category);
  if (filters.experience_level) chips.push(filters.experience_level);
  if (filters.contract_type) chips.push(filters.contract_type);
  if (filters.is_remote) chips.push("Remote");
  if (filters.salary_min)
    chips.push(`From R${Math.round(filters.salary_min / 12).toLocaleString("en-ZA")}/mo`);
  if (filters.salary_max)
    chips.push(`Up to R${Math.round(filters.salary_max / 12).toLocaleString("en-ZA")}/mo`);

  if (chips.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip}
          className="rounded-md bg-white px-2 py-0.5 text-[11.5px] font-medium text-[var(--accent-foreground)]"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}
