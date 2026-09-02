import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getActivities } from "../api/activities";
import { getApplications, getDueApplications } from "../api/application";
import { getAnalyticsSummary } from "../api/analytics";
import ActivityTimeline from "../components/ActivityTimeline";
import ActionCentre from "../components/ActionCenter";
import { statusColor } from "../lib/status";

function today() {
  return new Date().toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function DashboardPage() {
  const { data: activities } = useQuery({ queryKey: ["activities"], queryFn: getActivities });
  const { data: applications } = useQuery({ queryKey: ["applications"], queryFn: getApplications });
  const { data: analytics } = useQuery({ queryKey: ["analytics"], queryFn: getAnalyticsSummary });
  const { data: due } = useQuery({ queryKey: ["applications-due"], queryFn: getDueApplications });

  const total = applications?.length ?? 0;
  const interviews = applications?.filter((a) => a.status === "Interview").length ?? 0;
  const offers = applications?.filter((a) => a.status === "Offer").length ?? 0;
  const responseRate = analytics?.response_rate ?? 0;
  const dueCount = due?.length ?? 0;

  const statusBreakdown = Object.entries(analytics?.status_breakdown ?? {});
  const sourceEntries = Object.entries(analytics?.source_breakdown ?? {})
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 4);

  const stats = [
    { label: "Applied", value: total, note: "all time" },
    { label: "Interviews", value: interviews, note: interviews > 0 ? "in progress" : "keep applying" },
    { label: "Offers", value: offers, note: offers > 0 ? "well done" : "on the way" },
    { label: "Response rate", value: `${responseRate}%`, note: responseRate > 20 ? "above average" : "building up" },
  ];

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
          Your job search
        </h1>
        <p className="mt-1 text-[14.5px] text-[var(--muted-foreground)]">
          {today()}
          {dueCount > 0 && (
            <>
              {" · "}
              <span className="font-medium text-[var(--warning)]">
                {dueCount} follow-up{dueCount > 1 ? "s" : ""} due
              </span>
            </>
          )}
        </p>
      </header>

      {total === 0 && (
        <div className="jf-card mb-5 flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[15px] font-medium text-[var(--foreground)]">
              Nothing tracked yet
            </p>
            <p className="mt-1 text-[13.5px] text-[var(--muted-foreground)]">
              Apply to a job from the board and it lands here automatically.
            </p>
          </div>
          <Link
            to="/jobs"
            className="shrink-0 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-[13.5px] font-semibold text-white no-underline"
          >
            Find jobs
          </Link>
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="jf-card p-4">
            <div className="text-[30px] font-semibold leading-none tracking-[-0.03em] text-[var(--foreground)]">
              {stat.value}
            </div>
            <div className="mt-2 text-[12.5px] font-medium text-[var(--foreground)]">
              {stat.label}
            </div>
            <div className="mt-0.5 text-[12px] text-[var(--muted-foreground)]">
              {stat.note}
            </div>
          </div>
        ))}
      </div>

      {analytics?.best_source && (
        <div className="mb-4 rounded-xl bg-[var(--primary-soft)] px-5 py-4">
          <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--primary)]">
            Best performing source
          </p>
          <p className="mt-1 text-[14.5px] font-medium text-[var(--accent-foreground)]">
            {analytics.best_source} is getting you the most interviews — lean into it.
          </p>
        </div>
      )}

      {total > 0 && (
        <div className="mb-4 grid gap-3 lg:grid-cols-2">
          <section className="jf-card p-5">
            <h2 className="mb-4 text-[14px] font-semibold text-[var(--foreground)]">
              Pipeline
              <span className="ml-2 text-[12.5px] font-normal text-[var(--muted-foreground)]">
                where things stand
              </span>
            </h2>

            <div className="space-y-3.5">
              {statusBreakdown.map(([status, count]) => {
                const pct = Math.round(((count as number) / total) * 100);
                return (
                  <div key={status}>
                    <div className="mb-1.5 flex items-center justify-between">
                      {/* The colour swatch never stands alone — the label beside
                          it is what makes the CVD-adjacent pair readable. */}
                      <span className="flex items-center gap-2 text-[13px] text-[var(--foreground)]">
                        <span
                          aria-hidden
                          className="h-2 w-2 rounded-full"
                          style={{ background: statusColor(status) }}
                        />
                        {status}
                      </span>
                      <span className="text-[13px] font-medium text-[var(--muted-foreground)]">
                        {count as number} · {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: statusColor(status) }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="jf-card p-5">
            <h2 className="mb-3 text-[14px] font-semibold text-[var(--foreground)]">
              Where you're applying
            </h2>

            {sourceEntries.length === 0 ? (
              <p className="text-[13px] text-[var(--muted-foreground)]">
                No source data yet.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {sourceEntries.map(([source, stats]) => (
                  <li key={source} className="flex items-center justify-between py-2.5">
                    <div>
                      <div className="text-[13.5px] font-medium text-[var(--foreground)]">
                        {source}
                      </div>
                      <div className="text-[12px] text-[var(--muted-foreground)]">
                        {stats.total} application{stats.total === 1 ? "" : "s"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                        {stats.rate}%
                      </div>
                      <div className="text-[11.5px] text-[var(--muted-foreground)]">
                        interview rate
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="jf-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-[var(--foreground)]">
              Action centre
            </h2>
            {dueCount > 0 && (
              <span className="rounded-full bg-[var(--warning-soft)] px-2.5 py-0.5 text-[11.5px] font-semibold text-[var(--warning)]">
                {dueCount} due
              </span>
            )}
          </div>
          <ActionCentre compact />
        </section>

        <section className="jf-card p-5">
          <h2 className="mb-4 text-[14px] font-semibold text-[var(--foreground)]">
            Recent activity
          </h2>
          {activities && activities.length > 0 ? (
            <ActivityTimeline activities={activities.slice(0, 5)} />
          ) : (
            <p className="text-[13px] text-[var(--muted-foreground)]">
              No activity yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
