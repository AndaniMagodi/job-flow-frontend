import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { discoverJobs, type DiscoveredJob } from "../api/discover";
import { createApplication } from "../api/application";

const PRIORITY_STYLES = {
  high:   { bg: "#0a1f14", color: "#34d399", label: "Strong match" },
  medium: { bg: "#1c1a0e", color: "#fbbf24", label: "Good match" },
  low:    { bg: "#1a1a1a", color: "#888",    label: "Possible match" },
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#34d399" : score >= 50 ? "#fbbf24" : "#888";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0 }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: `3px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}</span>
      </div>
      <span style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" }}>match</span>
    </div>
  );
}

function JobCard({ job, onLog }: { job: DiscoveredJob; onLog: (job: DiscoveredJob) => void }) {
  const priority = PRIORITY_STYLES[job.apply_priority];
  const [logged, setLogged] = useState(false);

  return (
    <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 16, padding: 16, transition: "border-color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#333"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <ScoreRing score={job.match_score} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#ddd", margin: 0 }}>{job.job_title}</p>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: priority.bg, color: priority.color }}>
              {priority.label}
            </span>
            {job.is_remote && (
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "#1e1b4b", color: "#818cf8" }}>
                Remote
              </span>
            )}
          </div>

          <p style={{ fontSize: 12, color: "#555", margin: "3px 0 0" }}>
            {job.company} · {job.location || "Location not specified"}
          </p>

          <p style={{ fontSize: 12, color: "#888", margin: "8px 0 0", lineHeight: 1.5 }}>
            {job.match_reason}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
            {job.apply_link && (
              <a
                href={job.apply_link}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 12, color: "#6366f1", textDecoration: "none" }}
              >
                View job ↗
              </a>
            )}
            <button
              onClick={() => { onLog(job); setLogged(true); }}
              disabled={logged}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: 20,
                border: "none",
                cursor: logged ? "default" : "pointer",
                background: logged ? "#222" : "#6366f1",
                color: logged ? "#555" : "#fff",
                transition: "all 0.15s",
              }}
            >
              {logged ? "Logged ✓" : "+ Log application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["discover"],
    queryFn: discoverJobs,
    enabled: false,
    staleTime: 1000 * 60 * 10,
  });

  const logMutation = useMutation({
    mutationFn: (job: DiscoveredJob) => createApplication({
      company: job.company,
      role: job.job_title,
      date_applied: new Date().toISOString().slice(0, 10),
      link: job.apply_link,
      status: "Applied",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", margin: 0 }}>
          Discover
        </h2>
        <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
          AI-matched jobs based on your application history.
        </p>
      </div>

      {!data && !isLoading && (
        <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 16, padding: 40, textAlign: "center" }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#ddd", marginBottom: 6 }}>
            Find your next opportunity
          </p>
          <p style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>
            We'll analyse your application history and find jobs that match your profile.
          </p>
          <button
            onClick={() => refetch()}
            style={{ background: "#6366f1", color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 24px", borderRadius: 20, border: "none", cursor: "pointer" }}
          >
            Find matching jobs
          </button>
        </div>
      )}

      {isLoading && (
        <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 16, padding: 40, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#555" }}>Searching for jobs and analysing matches...</p>
          <p style={{ fontSize: 11, color: "#333", marginTop: 8 }}>This takes about 10 seconds</p>
        </div>
      )}

      {isError && (
        <div style={{ background: "#1a1a1a", border: "1px solid #3d2020", borderRadius: 16, padding: 20 }}>
          <p style={{ fontSize: 13, color: "#f87171" }}>Could not fetch jobs. Check your API keys and try again.</p>
          <button onClick={() => refetch()} style={{ marginTop: 10, fontSize: 12, color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}>
            Try again
          </button>
        </div>
      )}

      {data && (
        <>
          <div style={{ background: "#13102b", border: "1px solid #2d2a5e", borderRadius: 16, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 10, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                Based on your profile
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#a5b4fc", marginTop: 3 }}>
                Found {data.total} matching opportunities · searching as "{data.profile.roles_applied_for[0]}"
              </p>
            </div>
            <button
              onClick={() => refetch()}
              style={{ fontSize: 12, color: "#6366f1", background: "none", border: "1px solid #2d2a5e", borderRadius: 20, padding: "6px 14px", cursor: "pointer" }}
            >
              Refresh
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.jobs.map((job, i) => (
              <JobCard
                key={i}
                job={job}
                onLog={(j) => logMutation.mutate(j)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}