import type { Activity } from "../api/activities";

const EVENT_STYLES: Record<string, { color: string; label: string }> = {
  created:        { color: "#6366f1", label: "Applied" },
  status_changed: { color: "#f59e0b", label: "Status changed" },
  note_added:     { color: "#444",    label: "Note added" },
  follow_up_set:  { color: "#10b981", label: "Follow-up set" },
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
    return <p style={{ fontSize: 12, color: "#555" }}>No activity yet.</p>;
  }

  return (
    <div>
      {activities.map((activity, i) => {
        const style = EVENT_STYLES[activity.event] ?? { color: "#444", label: activity.event };
        const isLast = i === activities.length - 1;
        return (
          <div key={activity.id} style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: style.color, marginTop: 4, flexShrink: 0 }} />
              {!isLast && <div style={{ width: 1, flex: 1, background: "#2a2a2a", margin: "4px 0" }} />}
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", paddingBottom: isLast ? 0 : 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc" }}>{style.label}</div>
                {activity.detail && (
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{activity.detail}</div>
                )}
              </div>
              <div style={{ fontSize: 11, color: "#444", whiteSpace: "nowrap", marginLeft: 12, marginTop: 2 }}>
                {timeAgo(activity.created_at)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}