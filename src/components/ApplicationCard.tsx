import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import type { ApplicationStatus, JobApplication } from "../types/application";
import { setFollowUpDate, updateApplicationStatus } from "../api/application";
import { getApplicationActivities } from "../api/activities";
import ActivityTimeline from "./ActivityTimeline";
import CompanyLogo from "./CompanyLogo";
import { STATUS_ORDER, statusColor, statusSoft } from "../lib/status";
import { formatDate } from "../lib/format";

type Props = {
  application: JobApplication;
  onStatusChange?: (id: number, newStatus: ApplicationStatus) => void;
  onDelete?: (id: number) => void;
};

export default function ApplicationCard({
  application,
  onStatusChange,
  onDelete,
}: Props) {
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [updating, setUpdating] = useState(false);
  const [followUp, setFollowUp] = useState(application.follow_up_date ?? "");
  const [showTimeline, setShowTimeline] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { data: activities } = useQuery({
    queryKey: ["activities", application.id],
    queryFn: () => getApplicationActivities(application.id),
    enabled: showTimeline,
  });

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as ApplicationStatus;
    setUpdating(true);
    try {
      await updateApplicationStatus(application.id, newStatus);
      setStatus(newStatus);
      onStatusChange?.(application.id, newStatus);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdating(false);
    }
  }

  async function handleFollowUpChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDate = e.target.value;
    setFollowUp(newDate);
    try {
      await setFollowUpDate(application.id, newDate);
    } catch (err) {
      console.error("Failed to set follow-up", err);
    }
  }

  return (
    <article className="jf-card p-4 transition-colors hover:border-[var(--input)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <CompanyLogo company={application.company} size={36} />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[var(--foreground)]">
              {application.role}
            </p>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">
              {application.company}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={updating}
            aria-label={`Status for ${application.role}`}
            className="cursor-pointer rounded-full border-none px-3 py-1.5 text-[12px] font-semibold disabled:opacity-60"
            style={{ background: statusSoft(status), color: statusColor(status) }}
          >
            {STATUS_ORDER.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {confirmingDelete ? (
            <span className="flex items-center gap-1.5">
              <button
                onClick={() => onDelete?.(application.id)}
                className="rounded-md bg-[var(--destructive)] px-2.5 py-1.5 text-[12px] font-semibold text-white"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
                className="px-1.5 text-[12px] text-[var(--muted-foreground)]"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="rounded-md px-2 py-1.5 text-[12px] text-[var(--muted-foreground)] transition-colors hover:text-[var(--destructive)]"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-[var(--muted-foreground)]">
        <span>Applied {formatDate(application.date_applied)}</span>

        {application.link && (
          <a
            href={application.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-[var(--primary)] no-underline hover:underline"
          >
            View posting
            <ExternalLink size={12} />
          </a>
        )}

        <label className="flex items-center gap-1.5">
          Follow-up:
          <input
            type="date"
            value={followUp}
            onChange={handleFollowUpChange}
            className="cursor-pointer rounded border-none bg-transparent text-[12.5px] text-[var(--foreground)]"
          />
        </label>
      </div>

      {application.notes && (
        <p className="mt-2.5 text-[12.5px] italic leading-relaxed text-[var(--muted-foreground)]">
          {application.notes}
        </p>
      )}

      <div className="mt-3 border-t border-[var(--border)] pt-3">
        <button
          onClick={() => setShowTimeline((v) => !v)}
          className="text-[12.5px] font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
        >
          {showTimeline ? "Hide history" : "Show history"}
        </button>

        {showTimeline && activities && (
          <div className="mt-3.5">
            <ActivityTimeline activities={activities} />
          </div>
        )}
      </div>
    </article>
  );
}
