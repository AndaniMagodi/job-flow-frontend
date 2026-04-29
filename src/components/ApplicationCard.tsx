import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ApplicationStatus, JobApplication } from "../types/application";
import { updateApplicationStatus, setFollowUpDate } from "../api/application";
import { getApplicationActivities } from "../api/activities";
import ActivityTimeline from "./ActivityTimeline";

type Props = {
  application: JobApplication;
  onStatusChange?: (id: number, newStatus: ApplicationStatus) => void;
  onDelete?: (id: number) => void;
};

const STATUS_STYLES: Record<ApplicationStatus, { bg: string; color: string }> = {
  Applied:   { bg: "#1e1b4b", color: "#818cf8" },
  Interview: { bg: "#1c1a0e", color: "#fbbf24" },
  Offer:     { bg: "#0a1f14", color: "#34d399" },
  Rejected:  { bg: "#1f1010", color: "#f87171" },
};

const AVATAR_COLORS: Record<ApplicationStatus, { bg: string; color: string }> = {
  Applied:   { bg: "#1e1b4b", color: "#818cf8" },
  Interview: { bg: "#1c1a0e", color: "#fbbf24" },
  Offer:     { bg: "#0a1f14", color: "#34d399" },
  Rejected:  { bg: "#1f1010", color: "#f87171" },
};

function getLogoUrl(company: string) {
  const domain = company.toLowerCase().trim()
    .replace(/\s+(inc|ltd|llc|pty|co)\.?$/i, "")
    .replace(/\s+/g, "") + ".com";
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

const SOURCE_LOGOS: Record<string, string> = {
  linkedin:   "https://www.google.com/s2/favicons?domain=linkedin.com&sz=32",
  indeed:     "https://www.google.com/s2/favicons?domain=indeed.com&sz=32",
  greenhouse: "https://www.google.com/s2/favicons?domain=greenhouse.io&sz=32",
  lever:      "https://www.google.com/s2/favicons?domain=lever.co&sz=32",
  workday:    "https://www.google.com/s2/favicons?domain=workday.com&sz=32",
  pnet:       "https://www.google.com/s2/favicons?domain=pnet.co.za&sz=32",
};

function detectSource(link?: string): string | null {
  if (!link) return null;
  const url = link.toLowerCase();
  for (const key of Object.keys(SOURCE_LOGOS)) {
    if (url.includes(key)) return key;
  }
  return null;
}

function CompanyAvatar({ company, status, link }: {
  company: string; status: ApplicationStatus; link?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const source = detectSource(link);
  const sourceLogoUrl = source ? SOURCE_LOGOS[source] : null;
  const avatarStyle = AVATAR_COLORS[status];

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {!imgError ? (
        <img
          src={getLogoUrl(company)}
          alt={company}
          onError={() => setImgError(true)}
          style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain", background: "#222", border: "1px solid #2a2a2a", padding: 2 }}
        />
      ) : (
        <div style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: avatarStyle.bg, color: avatarStyle.color }}>
          {company.slice(0, 2).toUpperCase()}
        </div>
      )}
      {sourceLogoUrl && (
        <img
          src={sourceLogoUrl}
          alt={source!}
          style={{ position: "absolute", bottom: -3, right: -3, width: 14, height: 14, borderRadius: "50%", background: "#111", border: "1px solid #111", objectFit: "contain" }}
        />
      )}
    </div>
  );
}

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
      console.error("Failed to set follow-up", err);
    }
  }

  const statusStyle = STATUS_STYLES[status];

  return (
    <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 16, padding: "14px 16px", transition: "border-color 0.15s" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "#333")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "#222")}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <CompanyAvatar company={application.company} status={status} link={application.link} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#ddd", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {application.role}
            </p>
            <p style={{ fontSize: 11, color: "#555", margin: 0, marginTop: 2 }}>{application.company}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={updating}
            style={{ background: statusStyle.bg, color: statusStyle.color, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, border: "none", cursor: "pointer", outline: "none" }}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={() => onDelete?.(application.id)}
            style={{ fontSize: 11, color: "#333", background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={e => (e.currentTarget.style.color = "#333")}
          >
            Delete
          </button>
        </div>
      </div>

      <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, fontSize: 11, color: "#555" }}>
        <span>Applied {application.date_applied}</span>
        {application.link && (
          <a href={application.link} target="_blank" rel="noreferrer"
            style={{ color: "#6366f1", textDecoration: "none" }}>
            View posting ↗
          </a>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span>Follow-up:</span>
          <input
            type="date"
            value={followUp}
            onChange={handleFollowUpChange}
            style={{ background: "transparent", fontSize: 11, color: "#666", border: "none", outline: "none", cursor: "pointer" }}
          />
        </div>
      </div>

      {application.notes && (
        <p style={{ marginTop: 6, fontSize: 11, color: "#444", fontStyle: "italic" }}>{application.notes}</p>
      )}

      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #222" }}>
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          style={{ fontSize: 11, color: "#333", background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#888")}
          onMouseLeave={e => (e.currentTarget.style.color = "#333")}
        >
          {showTimeline ? "Hide history" : "Show history"}
        </button>
        {showTimeline && activities && (
          <div style={{ marginTop: 12 }}>
            <ActivityTimeline activities={activities} />
          </div>
        )}
      </div>
    </div>
  );
}