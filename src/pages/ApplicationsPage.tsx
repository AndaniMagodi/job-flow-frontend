import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ApplicationCard from "../components/ApplicationCard";
import QuickAddApplication from "../components/QuickAddApplication";
import { createApplication, getApplications } from "../api/application";

function uniqueSuggestions(values: string[] = []): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
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

  const companySuggestions = uniqueSuggestions(
    data?.map((application) => application.company),
  );
  const roleSuggestions = uniqueSuggestions(
    data?.map((application) => application.role),
  );

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Applications</h2>
        <p className="text-slate-600">
          Track all your submitted job applications in one place.
        </p>
      </div>

      <QuickAddApplication
        isSaving={createApplicationMutation.isPending}
        companySuggestions={companySuggestions}
        roleSuggestions={roleSuggestions}
        onSubmit={async (input) => {
          await createApplicationMutation.mutateAsync(input);
        }}
      />

      {isLoading && <p>Loading applications...</p>}
      {isError && <p>Something went wrong while loading applications.</p>}
      {createApplicationMutation.isError && (
        <p className="text-sm text-red-600">
          Could not save your application. Please try again.
        </p>
      )}

      <div className="grid gap-4">
        {data?.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </div>
    </section>
  );
}