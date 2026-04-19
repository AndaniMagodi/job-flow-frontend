import { useQuery } from "@tanstack/react-query";
import { getActivities } from "../api/activities";
import { getApplications } from "../api/application";
import ActivityTimeline from "../components/ActivityTimeline";
import ActionCentre from "../components/ActionCenter";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const responseRate = total > 0 ? Math.round((interviews + offers) / total * 100) : 0;

  const stats = [
    { label: "Applications", value: total, color: "text-slate-900" },
    { label: "Interviews", value: interviews, color: "text-amber-600" },
    { label: "Offers", value: offers, color: "text-emerald-600" },
    { label: "Response rate", value: `${responseRate}%`, color: "text-indigo-600" },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Here's where your job search stands.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-none">
            <CardContent className="pt-4">
              <p className={`text-3xl font-bold tracking-tight ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action centre */}
      <ActionCentre />

      {/* Activity feed */}
      <Card className="shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700">
            Recent activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activitiesLoading && (
            <p className="text-sm text-slate-400">Loading...</p>
          )}
          {activities?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">No activity yet.</p>
              <Link
                to="/applications/new"
                className="mt-3 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 transition"
              >
                Add your first application
              </Link>
            </div>
          )}
          {activities && activities.length > 0 && (
            <ActivityTimeline activities={activities} />
          )}
        </CardContent>
      </Card>
    </section>
  );
}