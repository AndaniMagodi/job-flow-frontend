import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ApplicationCard from "../components/ApplicationCard";
import QuickAddApplication from "../components/QuickAddApplication";
import {
  createApplication,
  getApplications,
  deleteApplication,
} from "../api/application";
import type { ApplicationStatus } from "../types/application";

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
    queryClient.setQueryData(["applications"], (old: any) =>
      old?.map((app: any) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  }

  const companySuggestions = uniqueSuggestions(
    data?.map((application) => application.company)
  );
  const roleSuggestions = uniqueSuggestions(
    data?.map((application) => application.role)
  );

  return (
    <section
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.5px",
            margin: 0,
          }}
        >
          Applications
        </h2>
        <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
          Every application you've logged, in one place.
        </p>
      </div>

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

      {isLoading && <p>Loading applications...</p>}
      {isError && (
        <p className="text-sm text-red-600">
          Something went wrong while loading applications.
        </p>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-700">
            No applications yet
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Add your first application using the form above.
          </p>
        </div>
      )}
      {createApplicationMutation.isError && (
        <p className="text-sm text-red-600">
          Could not save your application. Please try again.
        </p>
      )}

      <div className="grid gap-4">
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
