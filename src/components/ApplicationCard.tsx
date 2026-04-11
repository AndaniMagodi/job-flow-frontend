import { useState } from "react";
import type { JobApplication, ApplicationStatus } from "../types/application";
import { updateApplicationStatus } from "../api/application";

type Props = {
  application: JobApplication;
  onStatusChange?: (id: number, newStatus: ApplicationStatus) => void;
  onDelete?: (id: number) => void;
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Applied:   "bg-blue-100 text-blue-700",
  Interview: "bg-yellow-100 text-yellow-700",
  Offer:     "bg-green-100 text-green-700",
  Rejected:  "bg-red-100 text-red-700",
};

export default function ApplicationCard({ application, onStatusChange , onDelete }: Props) {
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [updating, setUpdating] = useState(false);

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

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{application.role}</h2>
          <p className="text-sm text-slate-600">{application.company}</p>
        </div>

        <div className="flex items-center gap-2">
  <select
    value={status}
    onChange={handleStatusChange}
    disabled={updating}
    className={`rounded-full px-3 py-1 text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[status]}`}
  >
    <option value="Applied">Applied</option>
    <option value="Interview">Interview</option>
    <option value="Offer">Offer</option>
    <option value="Rejected">Rejected</option>
  </select>

  <button
    onClick={() => onDelete?.(application.id)}
    className="text-xs text-slate-400 hover:text-red-500 transition-colors"
  >
    Delete
  </button>
</div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p>
          <span className="font-medium">Date Applied:</span>{" "}
          {application.dateApplied}
        </p>

        {application.link && (
          <p>
            <span className="font-medium">Job Link:</span>{" "}
            <a href={application.link} target="_blank" rel="noreferrer"
              className="text-blue-600 underline">
              View posting
            </a>
          </p>
        )}

        {application.notes && (
          <p>
            <span className="font-medium">Notes:</span> {application.notes}
          </p>
        )}
      </div>
    </div>
  );
}