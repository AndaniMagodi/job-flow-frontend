import { useQuery } from "@tanstack/react-query";
import { getDueApplications } from "../api/application";

function getDueBadge(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0)   return { label: `${Math.abs(diff)}d overdue`, bg: "#2d1515", color: "#f87171" };
  if (diff === 0) return { label: "Due today",                   bg: "#2d2010", color: "#fbbf24" };
  return           { label: `Due in ${diff}d`,                   bg: "#0f1e3d", color: "#60a5fa" };
}

export default function ActionCentre({ compact = false }: { compact?: boolean }) {
  const { data: due, isLoading } = useQuery({
    queryKey: ["applications-due"],
    queryFn: getDueApplications,
  });

  if (isLoading) return null;

  if (!due || due.length === 0) {
    return (
      <p style={{ fontSize: 12, color: "#555" }}>
        No follow-ups due. You're all caught up!
      </p>
    );
  }

  const items = compact ? due.slice(0, 3) : due;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((app) => {
        const badge = getDueBadge(app.follow_up_date!);
        const initials = app.company.slice(0, 2).toUpperCase();
        return (
          <div key={app.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#222", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1e1b4b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#818cf8", flexShrink: 0 }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>{app.role}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{app.company}</div>
              </div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: badge.bg, color: badge.color }}>
              {badge.label}
            </span>
          </div>
        );
      })}
      {compact && due.length > 3 && (
        <p style={{ fontSize: 11, color: "#555", textAlign: "center" }}>+{due.length - 3} more</p>
      )}
    </div>
  );
}