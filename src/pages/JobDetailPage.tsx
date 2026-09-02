import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  ExternalLink,
  GraduationCap,
  Loader2,
  MapPin,
  Wifi,
} from "lucide-react";
import CVMatchPanel from "../components/CVMatchPanel";
import SalaryEstimate from "../components/SalaryEstimate";
import {
  applyToJob,
  getJob,
  getSavedJobs,
  saveJob,
  unsaveJob,
} from "../api/jobs";
import { formatRelativeDate, formatSalary, isSampleListing } from "../lib/format";

export default function JobDetailPage() {
  const { id } = useParams();
  const jobId = Number(id);
  const queryClient = useQueryClient();

  const jobQuery = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
    enabled: Number.isFinite(jobId),
  });

  const savedQuery = useQuery({ queryKey: ["saved-jobs"], queryFn: getSavedJobs });
  const isSaved = savedQuery.data?.some((s) => s.job.id === jobId) ?? false;

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isSaved) await unsaveJob(jobId);
      else await saveJob(jobId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved-jobs"] }),
  });

  const applyMutation = useMutation({
    mutationFn: () => applyToJob(jobId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications"] }),
  });

  if (jobQuery.isLoading) {
    return (
      <div className="jf-card grid place-items-center py-20">
        <Loader2 size={22} className="animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  if (jobQuery.error || !jobQuery.data) {
    return (
      <div className="jf-card p-8 text-center">
        <p className="text-[15px] text-[var(--foreground)]">
          {(jobQuery.error as Error)?.message ?? "That job could not be found."}
        </p>
        <Link
          to="/jobs"
          className="mt-4 inline-block text-[13.5px] font-medium text-[var(--primary)]"
        >
          Back to all jobs
        </Link>
      </div>
    );
  }

  const job = jobQuery.data;
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_period);
  const isSample = isSampleListing(job.source);
  const applied = applyMutation.isSuccess;

  return (
    <div>
      <Link
        to="/jobs"
        className="mb-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--muted-foreground)] no-underline hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={15} />
        All jobs
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="jf-card p-6">
            <h1 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-[var(--foreground)]">
              {job.title}
            </h1>
            <p className="mt-1.5 text-[16px] text-[var(--muted-foreground)]">
              {job.company}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-[var(--muted-foreground)]">
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {job.location}
                </span>
              )}
              {job.is_remote && (
                <span className="flex items-center gap-1.5 font-medium text-[var(--success)]">
                  <Wifi size={14} />
                  Remote
                </span>
              )}
              <span>Posted {formatRelativeDate(job.posted_at).toLowerCase()}</span>
            </div>

            {salary && (
              <div className="mt-5 rounded-lg bg-[var(--muted)] px-4 py-3">
                <p className="text-[17px] font-semibold text-[var(--foreground)]">
                  {salary.primary}
                </p>
                {salary.secondary && (
                  <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">
                    {salary.secondary}
                    {job.salary_is_predicted && " · estimated by the source, not the employer"}
                  </p>
                )}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-1.5">
              {job.opportunity_type !== "Job" && (
                <span className="flex items-center gap-1 rounded-md bg-[var(--success-soft)] px-2.5 py-1 text-[12px] font-semibold text-[var(--success)]">
                  <GraduationCap size={13} />
                  {job.opportunity_type}
                </span>
              )}
              {job.no_experience_required && (
                <span className="rounded-md bg-[var(--primary-soft)] px-2.5 py-1 text-[12px] font-semibold text-[var(--accent-foreground)]">
                  No experience needed
                </span>
              )}
              {job.category && <Tag>{job.category}</Tag>}
              {job.experience_level && <Tag>{job.experience_level}</Tag>}
              {job.contract_type && <Tag>{job.contract_type}</Tag>}
            </div>
          </div>

          <div className="jf-card p-6">
            <h2 className="mb-3 text-[15px] font-semibold text-[var(--foreground)]">
              About this role
            </h2>
            <div className="whitespace-pre-wrap text-[14.5px] leading-[1.7] text-[var(--muted-foreground)]">
              {job.description || "No description was provided for this listing."}
            </div>

            {job.description_is_truncated && (
              <p className="mt-4 rounded-lg bg-[var(--muted)] px-3.5 py-3 text-[13px] text-[var(--muted-foreground)]">
                This description is shortened by the source. Open the original
                posting for the full advert.
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="jf-card p-5">
            {isSample ? (
              <p className="rounded-lg bg-[var(--warning-soft)] px-3.5 py-3 text-[13px] leading-relaxed text-[var(--warning)]">
                <strong className="font-semibold">Sample listing.</strong> This is
                demo data, not a real vacancy — there is nothing to apply to.
              </p>
            ) : (
              <>
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => applyMutation.mutate()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-3 text-[14px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
                >
                  Apply on {sourceLabel(job.source)}
                  <ExternalLink size={15} />
                </a>
                <p className="mt-2.5 text-center text-[12.5px] text-[var(--muted-foreground)]">
                  Opens the original posting and adds it to your tracker.
                </p>
              </>
            )}

            {applied && (
              <p className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--success-soft)] px-3 py-2.5 text-[13px] font-medium text-[var(--success)]">
                <Check size={14} />
                Added to your applications
              </p>
            )}

            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--input)] bg-white px-5 py-2.5 text-[13.5px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck size={15} className="text-[var(--primary)]" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark size={15} />
                  Save for later
                </>
              )}
            </button>
          </div>

          {!salary && <SalaryEstimate jobId={job.id} />}

          <CVMatchPanel jobId={job.id} />
        </aside>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-[var(--muted)] px-2.5 py-1 text-[12px] font-medium text-[var(--muted-foreground)]">
      {children}
    </span>
  );
}

function sourceLabel(source: string): string {
  const labels: Record<string, string> = {
    adzuna: "Adzuna",
    greenhouse: "the company site",
  };
  return labels[source] ?? "the original site";
}
