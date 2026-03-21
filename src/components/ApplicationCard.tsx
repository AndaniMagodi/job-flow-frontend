import type { JobApplication } from "../types/application";

type Props = {
  application: JobApplication;
};

export default function ApplicationCard({ application }: Props) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{application.role}</h2>
          <p className="text-sm text-slate-600">{application.company}</p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {application.status}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p>
          <span className="font-medium">Date Applied:</span>{" "}
          {application.dateApplied}
        </p>

        {application.link && (
          <p>
            <span className="font-medium">Job Link:</span>{" "}
            <a
              href={application.link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
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