import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, GraduationCap, MapPin, Wifi } from "lucide-react";
import type { Job } from "../types/job";
import CompanyLogo from "./CompanyLogo";
import { useDataSaver } from "../context/DataSaverContext";
import { formatRelativeDate, formatSalary, isSampleListing } from "../lib/format";

type Props = {
  job: Job;
  saved?: boolean;
  onToggleSave?: (job: Job) => void;
  saving?: boolean;
};

export default function JobCard({ job, saved, onToggleSave, saving }: Props) {
  const { dataSaver } = useDataSaver();
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_period);
  const isProgramme = job.opportunity_type !== "Job";

  return (
    <article className="jf-card group relative p-5 transition-shadow hover:shadow-[0_1px_3px_rgba(15,23,41,0.08),0_8px_24px_-8px_rgba(15,23,41,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <CompanyLogo company={job.company} size={40} />
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-semibold leading-snug tracking-[-0.01em] text-[var(--foreground)]">
            <Link
              to={`/jobs/${job.id}`}
              className="no-underline after:absolute after:inset-0 after:content-['']"
            >
              {job.title}
            </Link>
          </h3>
          <p className="mt-0.5 text-[14px] text-[var(--muted-foreground)]">
            {job.company}
          </p>
        </div>

        {onToggleSave && (
          <button
            // Sits above the card-wide link overlay so it stays clickable.
            className="relative z-10 shrink-0 rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--primary)] disabled:opacity-50"
            onClick={() => onToggleSave(job)}
            disabled={saving}
            aria-label={saved ? `Remove ${job.title} from saved` : `Save ${job.title}`}
            aria-pressed={!!saved}
          >
            {saved ? (
              <BookmarkCheck size={17} className="text-[var(--primary)]" />
            ) : (
              <Bookmark size={17} />
            )}
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-[var(--muted-foreground)]">
        {job.location && (
          <span className="flex items-center gap-1.5">
            <MapPin size={13} strokeWidth={2} />
            {job.location}
          </span>
        )}
        {job.is_remote && (
          <span className="flex items-center gap-1.5 font-medium text-[var(--success)]">
            <Wifi size={13} strokeWidth={2} />
            Remote
          </span>
        )}
        <span>{formatRelativeDate(job.posted_at)}</span>
      </div>

      {salary && (
        <p className="mt-3 text-[14px] font-semibold text-[var(--foreground)]">
          {salary.primary}
          {job.salary_is_predicted && (
            <span className="ml-1.5 text-[12px] font-normal text-[var(--muted-foreground)]">
              (estimated)
            </span>
          )}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {isProgramme && (
          <span className="flex items-center gap-1 rounded-md bg-[var(--success-soft)] px-2 py-1 text-[11.5px] font-semibold text-[var(--success)]">
            <GraduationCap size={12} />
            {job.opportunity_type}
          </span>
        )}
        {job.no_experience_required && (
          <span className="rounded-md bg-[var(--primary-soft)] px-2 py-1 text-[11.5px] font-semibold text-[var(--accent-foreground)]">
            No experience needed
          </span>
        )}
        {!dataSaver && job.category && <Tag>{job.category}</Tag>}
        {!dataSaver && job.experience_level && <Tag>{job.experience_level}</Tag>}
        {!dataSaver && job.contract_type && <Tag>{job.contract_type}</Tag>}
        {isSampleListing(job.source) && (
          <span className="rounded-md bg-[var(--warning-soft)] px-2 py-1 text-[11.5px] font-medium text-[var(--warning)]">
            Sample listing
          </span>
        )}
      </div>
    </article>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-[var(--muted)] px-2 py-1 text-[11.5px] font-medium text-[var(--muted-foreground)]">
      {children}
    </span>
  );
}
