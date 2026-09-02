import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { JobFacets, JobFilters as Filters } from "../types/job";

type Props = {
  facets?: JobFacets;
  filters: Filters;
  onChange: (next: Filters) => void;
};

// Monthly Rand brackets, converted to the annual figures the API stores.
const SALARY_BANDS = [
  { label: "Any salary", min: undefined, max: undefined },
  { label: "Up to R15 000 / month", min: undefined, max: 180_000 },
  { label: "R15 000 – R30 000 / month", min: 180_000, max: 360_000 },
  { label: "R30 000 – R50 000 / month", min: 360_000, max: 600_000 },
  { label: "R50 000 – R80 000 / month", min: 600_000, max: 960_000 },
  { label: "R80 000+ / month", min: 960_000, max: undefined },
];

export default function JobFilters({ facets, filters, onChange }: Props) {
  // On a phone the full panel would push the job list off-screen, so it starts
  // collapsed there; on desktop the sidebar is always open.
  const [openOnMobile, setOpenOnMobile] = useState(false);

  function set(patch: Partial<Filters>) {
    // Any filter change resets paging — page 3 of the old result set is
    // meaningless against a new one.
    onChange({ ...filters, ...patch, page: 1 });
  }

  const activeCount = [
    filters.province,
    filters.category,
    filters.experience_level,
    filters.contract_type,
    filters.opportunity_type,
    filters.is_remote ? "remote" : undefined,
    filters.no_experience_required ? "no-exp" : undefined,
    filters.salary_min ?? filters.salary_max,
  ].filter(Boolean).length;

  const activeBand = SALARY_BANDS.findIndex(
    (b) => b.min === filters.salary_min && b.max === filters.salary_max
  );

  return (
    <aside className="jf-card h-fit p-5">
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-2 text-[14px] font-semibold text-[var(--foreground)] lg:pointer-events-none"
          onClick={() => setOpenOnMobile((open) => !open)}
          aria-expanded={openOnMobile}
        >
          <SlidersHorizontal size={14} className="lg:hidden" />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[11.5px] font-semibold text-[var(--accent-foreground)] lg:hidden">
              {activeCount}
            </span>
          )}
        </button>
        {activeCount > 0 && (
          <button
            onClick={() =>
              onChange({ q: filters.q, page: 1, page_size: filters.page_size })
            }
            className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--primary)]"
          >
            <X size={12} />
            Clear {activeCount}
          </button>
        )}
      </div>

      <div className={`mt-5 space-y-5 ${openOnMobile ? "" : "hidden lg:block"}`}>
        <Select
          label="Opportunity"
          value={filters.opportunity_type ?? ""}
          options={facets?.opportunity_types ?? []}
          placeholder="Jobs and programmes"
          onChange={(v) => set({ opportunity_type: v || undefined })}
        />

        <Select
          label="Province"
          value={filters.province ?? ""}
          options={facets?.provinces ?? []}
          placeholder="All of South Africa"
          onChange={(v) => set({ province: v || undefined })}
        />

        <Select
          label="Sector"
          value={filters.category ?? ""}
          options={facets?.categories ?? []}
          placeholder="All sectors"
          onChange={(v) => set({ category: v || undefined })}
        />

        <Select
          label="Experience"
          value={filters.experience_level ?? ""}
          options={facets?.experience_levels ?? []}
          placeholder="Any level"
          onChange={(v) => set({ experience_level: v || undefined })}
        />

        <Select
          label="Contract"
          value={filters.contract_type ?? ""}
          options={facets?.contract_types ?? []}
          placeholder="Any type"
          onChange={(v) => set({ contract_type: v || undefined })}
        />

        <div>
          <label className="jf-label" htmlFor="filter-salary">
            Salary
          </label>
          <select
            id="filter-salary"
            className="jf-input"
            value={activeBand === -1 ? 0 : activeBand}
            onChange={(e) => {
              const band = SALARY_BANDS[Number(e.target.value)];
              set({ salary_min: band.min, salary_max: band.max });
            }}
          >
            {SALARY_BANDS.map((band, index) => (
              <option key={band.label} value={index}>
                {band.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2.5">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--primary)]"
              checked={filters.is_remote === true}
              onChange={(e) => set({ is_remote: e.target.checked || undefined })}
            />
            <span className="text-[13.5px] text-[var(--foreground)]">Remote only</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--primary)]"
              checked={filters.no_experience_required === true}
              onChange={(e) =>
                set({ no_experience_required: e.target.checked || undefined })
              }
            />
            <span className="text-[13.5px] text-[var(--foreground)]">
              No experience needed
            </span>
          </label>
        </div>
      </div>
    </aside>
  );
}

function Select({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const id = `filter-${label.toLowerCase()}`;

  return (
    <div>
      <label className="jf-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="jf-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
