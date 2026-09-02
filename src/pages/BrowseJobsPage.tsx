import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, SearchX } from "lucide-react";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";
import SmartSearchBar from "../components/SmartSearchBar";
import { browseJobs, getJobFacets, getSavedJobs, saveJob, unsaveJob } from "../api/jobs";
import { getAIStatus, smartSearch } from "../api/ai";
import { useDataSaver } from "../context/DataSaverContext";
import type { Job, JobFilters as Filters, SmartSearchResult } from "../types/job";

export default function BrowseJobsPage() {
  const queryClient = useQueryClient();
  const { pageSize } = useDataSaver();
  const [filters, setFilters] = useState<Filters>({ page: 1, page_size: pageSize });
  // When the AI answers, its result replaces the normal list until cleared.
  const [aiResult, setAiResult] = useState<SmartSearchResult | null>(null);

  const { data: aiStatus } = useQuery({
    queryKey: ["ai-status"],
    queryFn: getAIStatus,
    staleTime: Infinity,
  });

  const { data: facets } = useQuery({ queryKey: ["job-facets"], queryFn: getJobFacets });

  // Data-light mode asks for fewer jobs per request, so a smaller response.
  const effectiveFilters = { ...filters, page_size: pageSize };

  const jobsQuery = useQuery({
    queryKey: ["jobs", effectiveFilters],
    queryFn: () => browseJobs(effectiveFilters),
    enabled: aiResult === null,
  });

  const savedQuery = useQuery({ queryKey: ["saved-jobs"], queryFn: getSavedJobs });
  const savedIds = new Set(savedQuery.data?.map((s) => s.job.id) ?? []);

  const smartSearchMutation = useMutation({
    mutationFn: smartSearch,
    onSuccess: setAiResult,
  });

  const saveMutation = useMutation({
    mutationFn: async (job: Job) => {
      if (savedIds.has(job.id)) await unsaveJob(job.id);
      else await saveJob(job.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved-jobs"] }),
  });

  const jobs = aiResult ? aiResult.items : jobsQuery.data?.items ?? [];
  const total = aiResult ? aiResult.total : jobsQuery.data?.total ?? 0;
  const isLoading = aiResult ? false : jobsQuery.isLoading;
  const error = aiResult ? null : jobsQuery.error;

  const page = filters.page ?? 1;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
          Find your next role
        </h1>
        <p className="mt-1 text-[14.5px] text-[var(--muted-foreground)]">
          Jobs across South Africa — salaries shown in Rand, per month.
        </p>
      </header>

      <SmartSearchBar
        onSearch={(q) => {
          setAiResult(null);
          setFilters((f) => ({ ...f, q, page: 1 }));
        }}
        onSmartSearch={(q) => smartSearchMutation.mutate(q)}
        aiAvailable={!!aiStatus?.available}
        aiPending={smartSearchMutation.isPending}
        interpretation={aiResult?.filters ?? null}
        onClearInterpretation={() => {
          setAiResult(null);
          smartSearchMutation.reset();
        }}
        initialQuery={filters.q}
      />

      {smartSearchMutation.isError && (
        <p className="mt-3 rounded-lg bg-[var(--destructive-soft)] px-3.5 py-3 text-[13px] text-[var(--destructive)]">
          {(smartSearchMutation.error as Error).message}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className={aiResult ? "opacity-50" : undefined}>
          <JobFilters
            facets={facets}
            filters={filters}
            onChange={(next) => {
              setAiResult(null);
              setFilters(next);
            }}
          />
        </div>

        <section>
          <div className="mb-3.5 flex items-center justify-between">
            <p className="text-[13.5px] text-[var(--muted-foreground)]">
              {isLoading ? "Searching…" : `${total} ${total === 1 ? "job" : "jobs"}`}
            </p>
          </div>

          {isLoading && (
            <div className="jf-card grid place-items-center py-16">
              <Loader2 size={22} className="animate-spin text-[var(--muted-foreground)]" />
            </div>
          )}

          {error && (
            <div className="jf-card p-6 text-center">
              <p className="text-[14px] text-[var(--destructive)]">
                {(error as Error).message}
              </p>
            </div>
          )}

          {!isLoading && !error && jobs.length === 0 && (
            <div className="jf-card grid place-items-center gap-3 py-16 text-center">
              <SearchX size={28} className="text-[var(--muted-foreground)]" />
              <div>
                <p className="text-[15px] font-medium text-[var(--foreground)]">
                  No jobs match those filters
                </p>
                <p className="mt-1 text-[13.5px] text-[var(--muted-foreground)]">
                  Try widening the province, sector or salary range.
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                saved={savedIds.has(job.id)}
                onToggleSave={(j) => saveMutation.mutate(j)}
                saving={saveMutation.isPending && saveMutation.variables?.id === job.id}
              />
            ))}
          </div>

          {!aiResult && totalPages > 1 && (
            <nav className="mt-6 flex items-center justify-center gap-2">
              <PageButton
                disabled={page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: page - 1 }))}
              >
                Previous
              </PageButton>
              <span className="px-2 text-[13px] text-[var(--muted-foreground)]">
                Page {page} of {totalPages}
              </span>
              <PageButton
                disabled={page >= totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: page + 1 }))}
              >
                Next
              </PageButton>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}

function PageButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-[var(--input)] bg-white px-3.5 py-2 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:opacity-40"
    >
      {children}
    </button>
  );
}
