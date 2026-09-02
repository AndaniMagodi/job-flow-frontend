import { useQuery } from "@tanstack/react-query";
import { getDueApplications } from "../api/application";
import CompanyLogo from "./CompanyLogo";

type Badge = { label: string; bg: string; color: string };

function getDueBadge(dateStr: string): Badge {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  const days = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (days < 0)
    return {
      label: `${Math.abs(days)}d overdue`,
      bg: "var(--destructive-soft)",
      color: "var(--destructive)",
    };
  if (days === 0)
    return { label: "Due today", bg: "var(--warning-soft)", color: "var(--warning)" };
  return { label: `Due in ${days}d`, bg: "var(--primary-soft)", color: "var(--primary)" };
}

export default function ActionCentre({ compact = false }: { compact?: boolean }) {
  const { data: due, isLoading } = useQuery({
    queryKey: ["applications-due"],
    queryFn: getDueApplications,
  });

  if (isLoading) return null;

  if (!due || due.length === 0) {
    return (
      <p className="text-[13px] text-[var(--muted-foreground)]">
        No follow-ups due — you're all caught up.
      </p>
    );
  }

  const items = compact ? due.slice(0, 3) : due;

  return (
    <div className="flex flex-col gap-2">
      {items.map((app) => {
        const badge = getDueBadge(app.follow_up_date!);

        return (
          <div
            key={app.id}
            className="flex items-center justify-between gap-3 rounded-lg bg-[var(--muted)] px-3 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <CompanyLogo company={app.company} size={32} />
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium text-[var(--foreground)]">
                  {app.role}
                </div>
                <div className="truncate text-[12px] text-[var(--muted-foreground)]">
                  {app.company}
                </div>
              </div>
            </div>

            <span
              className="shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
              style={{ background: badge.bg, color: badge.color }}
            >
              {badge.label}
            </span>
          </div>
        );
      })}

      {compact && due.length > 3 && (
        <p className="text-center text-[12px] text-[var(--muted-foreground)]">
          +{due.length - 3} more
        </p>
      )}
    </div>
  );
}
