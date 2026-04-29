import { useQuery } from "@tanstack/react-query";
import { getActivities } from "../api/activities";
import { getApplications, getDueApplications } from "../api/application";
import { getAnalyticsSummary } from "../api/analytics";
import ActivityTimeline from "../components/ActivityTimeline";
import ActionCentre from "../components/ActionCenter";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function todayStr() {
  return new Date().toLocaleDateString("en-ZA", {
    weekday: "long", day: "numeric", month: "long",
  });
}

const card: React.CSSProperties = {
  background: "#1a1a1a",
  border: "1px solid #222",
  borderRadius: 16,
  padding: "16px",
};

const cardTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#fff",
  marginBottom: 14,
  letterSpacing: "-0.2px",
};

export default function DashboardPage() {
  const { data: activities } = useQuery({ queryKey: ["activities"], queryFn: getActivities });
  const { data: applications } = useQuery({ queryKey: ["applications"], queryFn: getApplications });
  const { data: analytics } = useQuery({ queryKey: ["analytics"], queryFn: getAnalyticsSummary });
  const { data: due } = useQuery({ queryKey: ["applications-due"], queryFn: getDueApplications });

  const total = applications?.length ?? 0;
  const interviews = applications?.filter(a => a.status === "Interview").length ?? 0;
  const offers = applications?.filter(a => a.status === "Offer").length ?? 0;
  const responseRate = analytics?.response_rate ?? 0;
  const dueCount = due?.length ?? 0;

  const statusBreakdown = Object.entries(analytics?.status_breakdown ?? {});
  const STATUS_COLORS: Record<string, string> = {
    Applied: "#6366f1",
    Interview: "#f59e0b",
    Offer: "#10b981",
    Rejected: "#ef4444",
  };

  const sourceEntries = Object.entries(analytics?.source_breakdown ?? {})
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 4);

  const stats = [
    { label: "Applied", value: total, color: "#fff", trend: "all time" },
    { label: "Interviews", value: interviews, color: "#f59e0b", trend: interviews > 0 ? "in progress" : "keep applying" },
    { label: "Offers", value: offers, color: "#10b981", trend: offers > 0 ? "keep going 🎉" : "on the way" },
    { label: "Response rate", value: `${responseRate}%`, color: "#818cf8", trend: responseRate > 20 ? "↑ above avg" : "building up" },
  ];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>

      {/* Hero */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.8px", lineHeight: 1.2 }}>
          Your job search,<br />in one place.
        </h1>
        <p style={{ fontSize: 14, color: "#555", marginTop: 6 }}>
          {todayStr()}
          {dueCount > 0 && (
            <span style={{ color: "#f59e0b", fontWeight: 500 }}>
              {" "}· {dueCount} follow-up{dueCount > 1 ? "s" : ""} need attention
            </span>
          )}
        </p>
        {total > 0 && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: 20, padding: "6px 14px", marginTop: 14 }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontSize: 12, color: "#aaa" }}>Applying streak</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>{total} applications logged</span>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {s.label}
            </div>
            <div style={{ fontSize: 11, color: s.trend.startsWith("↑") ? "#10b981" : "#555", marginTop: 4 }}>
              {s.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Insight banner */}
      {analytics?.best_source && (
        <div style={{ background: "#13102b", border: "1px solid #2d2a5e", borderRadius: 16, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
              Top performing source this month
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#a5b4fc" }}>
              {analytics.best_source} is getting you the most interviews — lean into it
            </div>
          </div>
          <span style={{ fontSize: 22 }}>🏆</span>
        </div>
      )}

      {/* Pipeline + Sources */}
      {total > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div style={card}>
            <div style={cardTitle}>
              Pipeline
              <span style={{ fontSize: 11, fontWeight: 400, color: "#555", marginLeft: 6 }}>where things stand</span>
            </div>
            {statusBreakdown.map(([status, count]) => {
              const pct = Math.round((count as number) / total * 100);
              return (
                <div key={status} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "#888" }}>{status}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#ccc" }}>{count as number} · {pct}%</span>
                  </div>
                  <div style={{ height: 6, background: "#2a2a2a", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: STATUS_COLORS[status] ?? "#555", borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={card}>
            <div style={cardTitle}>Where you're applying</div>
            {sourceEntries.map(([source, stats]) => (
              <div key={source} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #222" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#ccc" }}>{source}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{stats.total} applications</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#818cf8", letterSpacing: "-0.5px" }}>{stats.rate}%</div>
                  <div style={{ fontSize: 10, color: "#555" }}>interview rate</div>
                </div>
              </div>
            ))}
            {sourceEntries.length === 0 && (
              <p style={{ fontSize: 12, color: "#555" }}>No source data yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Action centre + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={card}>
          <div style={{ ...cardTitle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Action centre</span>
            {dueCount > 0 && (
              <span style={{ fontSize: 10, fontWeight: 600, color: "#f87171", background: "#2d1515", padding: "2px 8px", borderRadius: 20 }}>
                {dueCount} due
              </span>
            )}
          </div>
          <ActionCentre compact />
        </div>

        <div style={card}>
          <div style={cardTitle}>Recent activity</div>
          {activities?.length === 0 && (
            <p style={{ fontSize: 12, color: "#555" }}>No activity yet — log your first application.</p>
          )}
          {activities && activities.length > 0 && (
            <ActivityTimeline activities={activities.slice(0, 5)} />
          )}
        </div>
      </div>
    </div>
  );
}