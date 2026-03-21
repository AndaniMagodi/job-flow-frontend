import { useQuery } from "@tanstack/react-query";
import ApplicationCard from "../components/ApplicationCard";
import { getApplications } from "../api/application";

export default function ApplicationsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Applications</h2>
        <p className="text-slate-600">
          Track all your submitted job applications in one place.
        </p>
      </div>

      {isLoading && <p>Loading applications...</p>}
      {isError && <p>Something went wrong while loading applications.</p>}

      <div className="grid gap-4">
        {data?.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </div>
    </section>
  );
}