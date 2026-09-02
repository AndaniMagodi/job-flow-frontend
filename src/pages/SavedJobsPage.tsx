import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Bookmark, Loader2 } from "lucide-react";
import JobCard from "../components/JobCard";
import { getSavedJobs, unsaveJob } from "../api/jobs";

export default function SavedJobsPage() {
  const queryClient = useQueryClient();

  const savedQuery = useQuery({ queryKey: ["saved-jobs"], queryFn: getSavedJobs });

  const removeMutation = useMutation({
    mutationFn: (jobId: number) => unsaveJob(jobId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved-jobs"] }),
  });

  const saved = savedQuery.data ?? [];

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
          Saved jobs
        </h1>
        <p className="mt-1 text-[14.5px] text-[var(--muted-foreground)]">
          Roles you've bookmarked to come back to.
        </p>
      </header>

      {savedQuery.isLoading && (
        <div className="jf-card grid place-items-center py-16">
          <Loader2 size={22} className="animate-spin text-[var(--muted-foreground)]" />
        </div>
      )}

      {savedQuery.error && (
        <div className="jf-card p-6 text-center text-[14px] text-[var(--destructive)]">
          {(savedQuery.error as Error).message}
        </div>
      )}

      {!savedQuery.isLoading && !savedQuery.error && saved.length === 0 && (
        <div className="jf-card grid place-items-center gap-3 py-16 text-center">
          <Bookmark size={28} className="text-[var(--muted-foreground)]" />
          <div>
            <p className="text-[15px] font-medium text-[var(--foreground)]">
              Nothing saved yet
            </p>
            <p className="mt-1 text-[13.5px] text-[var(--muted-foreground)]">
              Tap the bookmark on any job to keep it here.
            </p>
          </div>
          <Link
            to="/jobs"
            className="mt-1 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-[13.5px] font-semibold text-white no-underline"
          >
            Browse jobs
          </Link>
        </div>
      )}

      <div className="grid gap-3">
        {saved.map((entry) => (
          <JobCard
            key={entry.id}
            job={entry.job}
            saved
            onToggleSave={(job) => removeMutation.mutate(job.id)}
            saving={removeMutation.isPending && removeMutation.variables === entry.job.id}
          />
        ))}
      </div>
    </div>
  );
}
