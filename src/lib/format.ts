/** Formatting helpers for South African job data. */

const ZAR = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

/**
 * Salaries arrive as annual Rand amounts. Most South African job seekers think
 * in monthly take-home, so we lead with the monthly figure and keep the annual
 * range as the secondary line.
 */
export function formatSalary(
  min?: number | null,
  max?: number | null,
  period?: string | null
): { primary: string; secondary?: string } | null {
  if (min == null && max == null) return null;

  const isAnnual = period === "year";
  const toMonthly = (v: number) => (isAnnual ? v / 12 : v);

  const lo = min == null ? null : toMonthly(min);
  const hi = max == null ? null : toMonthly(max);

  let primary: string;
  if (lo != null && hi != null) {
    primary = `${ZAR.format(lo)} – ${ZAR.format(hi)}`;
  } else {
    primary = `${lo != null ? "From " : "Up to "}${ZAR.format(lo ?? hi!)}`;
  }
  primary += " / month";

  if (!isAnnual) return { primary };

  const annual =
    min != null && max != null
      ? `${ZAR.format(min)} – ${ZAR.format(max)}`
      : ZAR.format(min ?? max!);

  return { primary, secondary: `${annual} per year` };
}

export function formatRelativeDate(iso?: string | null): string {
  if (!iso) return "Recently";

  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Recently";

  const days = Math.floor((Date.now() - then) / 86_400_000);

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "Last week";
  if (days < 31) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Sample rows carry no real apply link; the UI must not offer one. */
export function isSampleListing(source: string): boolean {
  return source === "seed";
}
