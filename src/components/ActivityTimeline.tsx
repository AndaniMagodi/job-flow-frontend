import type { Activity } from "../api/activities";

const EVENT_STYLES: Record<string, { color: string; label: string }> = {
  created:        { color: "bg-blue-500",   label: "Applied" },
  status_changed: { color: "bg-yellow-500", label: "Status changed" },
  note_added:     { color: "bg-slate-400",  label: "Note added" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return <p className="text-sm text-slate-400">No activity yet.</p>;
  }

  return (
    <ol className="relative border-l border-slate-200 space-y-4 ml-2">
      {activities.map((activity) => {
        const style = EVENT_STYLES[activity.event] ?? { color: "bg-slate-400", label: activity.event };
        return (
          <li key={activity.id} className="ml-4">
            <span className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full ${style.color}`} />
            <p className="text-xs text-slate-400">{formatDate(activity.created_at)}</p>
            <p className="text-sm font-medium text-slate-700">{style.label}</p>
            {activity.detail && (
              <p className="text-sm text-slate-500">{activity.detail}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}