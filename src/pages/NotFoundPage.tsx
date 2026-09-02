import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="jf-card grid place-items-center gap-3 py-20 text-center">
      <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
        Page not found
      </h1>
      <p className="text-[14.5px] text-[var(--muted-foreground)]">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/jobs"
        className="mt-1 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-[13.5px] font-semibold text-white no-underline"
      >
        Browse jobs
      </Link>
    </div>
  );
}
