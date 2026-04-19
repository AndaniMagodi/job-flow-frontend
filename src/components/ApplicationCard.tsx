import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ApplicationStatus, JobApplication } from "../types/application";
import { updateApplicationStatus, setFollowUpDate } from "../api/application";
import { getApplicationActivities } from "../api/activities";
import ActivityTimeline from "./ActivityTimeline";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  application: JobApplication;
  onStatusChange?: (id: number, newStatus: ApplicationStatus) => void;
  onDelete?: (id: number) => void;
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied:   "bg-blue-50 text-blue-700 hover:bg-blue-50",
  Interview: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  Offer:     "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  Rejected:  "bg-red-50 text-red-700 hover:bg-red-50",
};

function getInitials(company: string) {
  return company.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS: Record<ApplicationStatus, string> = {
  Applied:   "bg-blue-50 text-blue-600",
  Interview: "bg-amber-50 text-amber-600",
  Offer:     "bg-emerald-50 text-emerald-600",
  Rejected:  "bg-slate-100 text-slate-400",
};

export default function ApplicationCard({ application, onStatusChange, onDelete }: Props) {
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [updating, setUpdating] = useState(false);
  const [followUp, setFollowUp] = useState(application.follow_up_date ?? "");
  const [showTimeline, setShowTimeline] = useState(false);

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
      console.error("Failed to set follow-up date", err);
    }
  }

  return (
    <Card className="shadow-none hover:border-slate-300 transition-colors">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[status]}`}>
              {getInitials(application.company)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{application.role}</p>
              <p className="text-xs text-slate-400">{application.company}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={handleStatusChange}
              disabled={updating}
              className={`rounded-full px-3 py-1 text-xs font-medium border-0 cursor-pointer outline-none ${STATUS_STYLES[status]}`}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button
              onClick={() => onDelete?.(application.id)}
              className="text-xs text-slate-300 hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span>Applied {application.dateApplied}</span>
          {application.link && (
            <a href={application.link} target="_blank" rel="noreferrer"
              className="text-indigo-500 hover:text-indigo-700 transition-colors">
              View posting
            </a>
          )}
          <div className="flex items-center gap-1">
            <span>Follow-up:</span>
            <input
              type="date"
              value={followUp}
              onChange={handleFollowUpChange}
              className="rounded border-0 bg-transparent text-xs text-slate-500 outline-none cursor-pointer"
            />
          </div>
        </div>

        {application.notes && (
          <p className="mt-2 text-xs text-slate-400 italic">{application.notes}</p>
        )}

        <div className="mt-3 border-t border-slate-50 pt-3">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="text-xs text-slate-300 hover:text-slate-500 transition-colors"
          >
            {showTimeline ? "Hide history" : "Show history"}
          </button>
          {showTimeline && activities && (
            <div className="mt-3">
              <ActivityTimeline activities={activities} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}