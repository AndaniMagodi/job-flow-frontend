import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import ApplicationCard from "../components/ApplicationCard";
import QuickAddApplication from "../components/QuickAddApplication";
import {
  createApplication,
  getApplications,
  deleteApplication,
} from "../api/application";
import type { ApplicationStatus, JobApplication } from "../types/application";

function uniqueSuggestions(values: string[] = []): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean))
  ).slice(0, 12);
}

export default function ApplicationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  const createApplicationMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  function handleStatusChange(id: number, newStatus: ApplicationStatus) {
    // The card already persisted the change; this just keeps the cached list
    // in step without a refetch.
    queryClient.setQueryData<JobApplication[]>(["applications"], (old) =>
      old?.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  }

  const companySuggestions = uniqueSuggestions(
    data?.map((application) => application.company)
  );
  const roleSuggestions = uniqueSuggestions(
    data?.map((application) => application.role)
  );

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
          My applications
        </h1>
        <p className="mt-1 text-[14.5px] text-[var(--muted-foreground)]">
          Every application you've logged, in one place.
        </p>
      </header>

      <QuickAddApplication
        isSaving={createApplicationMutation.isPending}
        companySuggestions={companySuggestions}
        roleSuggestions={roleSuggestions}
        onSubmit={async (input) => {
          await createApplicationMutation.mutateAsync({
            ...input,
            date_applied: new Date().toISOString().slice(0, 10),
          });
        }}
      />

      {isLoading && (
        <p className="text-[14px] text-[var(--muted-foreground)]">
          Loading applications…
        </p>
      )}

      {isError && (
        <p className="rounded-lg bg-[var(--destructive-soft)] px-3.5 py-3 text-[13.5px] text-[var(--destructive)]">
          Something went wrong while loading applications.
        </p>
      )}

      {createApplicationMutation.isError && (
        <p className="mb-3 rounded-lg bg-[var(--destructive-soft)] px-3.5 py-3 text-[13.5px] text-[var(--destructive)]">
          Could not save your application. Please try again.
        </p>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <div className="jf-card grid place-items-center gap-3 py-16 text-center">
          <div>
            <p className="text-[15px] font-medium text-[var(--foreground)]">
              No applications yet
            </p>
            <p className="mt-1 text-[13.5px] text-[var(--muted-foreground)]">
              Apply from the job board, or add one with the form above.
            </p>
          </div>
          <Link
            to="/jobs"
            className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-[13.5px] font-semibold text-white no-underline"
          >
            Find jobs
          </Link>
        </div>
      )}

      {/* Responsive card grid, kept from main — the list reads far better
          than a single column once you have more than a handful. */}
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
        {data?.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onStatusChange={handleStatusChange}
            onDelete={(id) => deleteApplicationMutation.mutate(id)}
          />
        ))}
      </div>
    </section>
  );
}
