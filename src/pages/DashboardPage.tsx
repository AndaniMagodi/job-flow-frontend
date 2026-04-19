import { useQuery } from "@tanstack/react-query";
import { getActivities } from "../api/activities";
import { getApplications } from "../api/application";
import ActivityTimeline from "../components/ActivityTimeline";
import ActionCentre from "../components/ActionCenter";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });

  const { data: applications } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  const total = applications?.length ?? 0;
  const interviews = applications?.filter(a => a.status === "Interview").length ?? 0;
  const offers = applications?.filter(a => a.status === "Offer").length ?? 0;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-slate-600">Here's where your job search stands.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-slate-500 mt-1">Applications</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">{interviews}</p>
          <p className="text-xs text-slate-500 mt-1">Interviews</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{offers}</p>
          <p className="text-xs text-slate-500 mt-1">Offers</p>
        </div>
      </div>

      {/* Action centre */}
      <ActionCentre />

      {/* Activity feed */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {activitiesLoading && (
          <p className="text-sm text-slate-400">Loading...</p>
        )}
        {activities?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">No activity yet.</p>
            <Link
              to="/applications/new"
              className="mt-3 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
            >
              Add your first application
            </Link>
          </div>
        )}
        {activities && activities.length > 0 && (
          <ActivityTimeline activities={activities} />
        )}
      </div>
    </section>
  );
}