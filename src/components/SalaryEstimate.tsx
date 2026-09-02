import { useQuery } from "@tanstack/react-query";
import { Info, TrendingUp } from "lucide-react";
import { getSalaryEstimate } from "../api/jobs";

const ZAR = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

const CONFIDENCE_NOTE: Record<string, string> = {
  high: "Comparable adverts cluster tightly, so this is a reliable guide.",
  medium: "A reasonable guide, though advertised pay varies.",
  low: "Based on a small or scattered sample — treat it as a rough idea only.",
};

/**
 * Shown only where the employer published nothing. Most South African adverts
 * omit salary, which leaves seekers negotiating blind; this says what similar
 * advertised roles pay, and is always labelled as our estimate rather than
 * the employer's figure.
 */
export default function SalaryEstimate({ jobId }: { jobId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["salary-estimate", jobId],
    queryFn: () => getSalaryEstimate(jobId),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || !data) return null;

  return (
    <section className="jf-card overflow-hidden">
      <header className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--muted)] px-5 py-3">
        <TrendingUp size={15} className="text-[var(--foreground)]" />
        <h2 className="text-[13.5px] font-semibold text-[var(--foreground)]">
          What similar roles pay
        </h2>
      </header>

      <div className="p-5">
        <p className="text-[19px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
          {ZAR.format(data.p25)} – {ZAR.format(data.p75)}
          <span className="ml-1 text-[13px] font-normal text-[var(--muted-foreground)]">
            / month
          </span>
        </p>
        <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">
          Typical is around {ZAR.format(data.median)}
        </p>

        {/* A range only means something if you can see where the middle sits. */}
        <div className="mt-4">
          <div className="relative h-1.5 rounded-full bg-[var(--muted)]">
            <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-[var(--primary-soft)]" />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--primary)]"
              style={{
                left: `${((data.median - data.p25) / Math.max(1, data.p75 - data.p25)) * 100}%`,
              }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[11.5px] text-[var(--muted-foreground)]">
            <span>Lower quarter</span>
            <span>Upper quarter</span>
          </div>
        </div>

        <p className="mt-4 flex items-start gap-1.5 text-[12px] leading-relaxed text-[var(--muted-foreground)]">
          <Info size={13} className="mt-0.5 shrink-0" />
          <span>
            This employer didn't state a salary. Estimated from{" "}
            <strong className="font-semibold">{data.sample_size}</strong>{" "}
            {data.basis} advertised on JobFlow — not a figure from this company.{" "}
            {CONFIDENCE_NOTE[data.confidence]}
          </span>
        </p>
      </div>
    </section>
  );
}
