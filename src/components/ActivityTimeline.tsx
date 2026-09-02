import type { Activity } from "../api/activities";

const EVENT_STYLES: Record<string, { color: string; label: string }> = {
  created: { color: "#4f46e5", label: "Applied" },
  status_changed: { color: "#0284c7", label: "Status changed" },
  note_added: { color: "#64748b", label: "Note added" },
  follow_up_set: { color: "#047857", label: "Follow-up set" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

export default function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <p className="text-[13px] text-[var(--muted-foreground)]">No activity yet.</p>
    );
  }

  return (
    <ol className="list-none p-0">
      {activities.map((activity, index) => {
        const style = EVENT_STYLES[activity.event] ?? {
          color: "#64748b",
          label: activity.event,
        };
        const isLast = index === activities.length - 1;

        return (
          <li key={activity.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                aria-hidden
                className="mt-1.5 h-[7px] w-[7px] shrink-0 rounded-full"
                style={{ background: style.color }}
              />
              {!isLast && <span className="my-1 w-px flex-1 bg-[var(--border)]" />}
            </div>

            <div
              className={`flex flex-1 justify-between gap-3 ${isLast ? "" : "pb-3.5"}`}
            >
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-[var(--foreground)]">
                  {style.label}
                </div>
                {activity.detail && (
                  <div className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--muted-foreground)]">
                    {activity.detail}
                  </div>
                )}
              </div>
              <time className="mt-0.5 shrink-0 text-[12px] text-[var(--muted-foreground)]">
                {timeAgo(activity.created_at)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
