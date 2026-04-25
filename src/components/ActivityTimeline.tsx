import type { Activity } from "../api/activities";

const EVENT_STYLES: Record<string, { color: string; label: string }> = {
  created:        { color: "bg-indigo-500", label: "Applied" },
  status_changed: { color: "bg-amber-500",  label: "Status changed" },
  note_added:     { color: "bg-slate-400",  label: "Note added" },
  follow_up_set:  { color: "bg-emerald-500", label: "Follow-up set" },
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
    <ol className="relative border-l border-slate-100 space-y-4 ml-2">
      {activities.map((activity) => {
        const style = EVENT_STYLES[activity.event] ?? {
          color: "bg-slate-400",
          label: activity.event,
        };
        return (
          <li key={activity.id} className="ml-4">
            <span className={`absolute -left-1.5 mt-1.5 h-2.5 w-2.5 rounded-full ${style.color}`} />
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-slate-600">{style.label}</p>
              <span className="text-xs text-slate-300">·</span>
              <p className="text-xs text-slate-400">{formatDate(activity.created_at)}</p>
            </div>
            {activity.detail && (
              <p className="text-xs text-slate-500 mt-0.5">{activity.detail}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}