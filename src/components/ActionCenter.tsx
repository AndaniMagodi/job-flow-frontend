import { useQuery } from "@tanstack/react-query";
import { getDueApplications } from "../api/application";

function getDueBadge(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0)  return { label: `${Math.abs(diff)}d overdue`, color: "bg-red-100 text-red-700" };
  if (diff === 0) return { label: "Due today",                  color: "bg-yellow-100 text-yellow-700" };
  return           { label: `Due in ${diff}d`,                  color: "bg-blue-100 text-blue-700" };
}

export default function ActionCentre() {
  const { data: due, isLoading } = useQuery({
    queryKey: ["applications-due"],
    queryFn: getDueApplications,
  });

  if (isLoading) return null;
  if (!due || due.length === 0) return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-1">Action Centre</h3>
      <p className="text-sm text-slate-400">No follow-ups due. You're all caught up! 🎉</p>
    </div>
  );

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Action Centre</h3>
      <p className="text-sm text-slate-500 mb-3">
        {due.length} application{due.length > 1 ? "s" : ""} need your attention
      </p>
      <ul className="space-y-2">
        {due.map((app) => {
          const badge = getDueBadge(app.follow_up_date!);
          return (
            <li key={app.id} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
              <div>
                <p className="text-sm font-medium">{app.role}</p>
                <p className="text-xs text-slate-500">{app.company}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.color}`}>
                {badge.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}