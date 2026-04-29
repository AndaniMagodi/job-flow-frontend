import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary } from "../api/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_COLORS: Record<string, string> = {
  Applied:   "bg-blue-500",
  Interview: "bg-amber-500",
  Offer:     "bg-emerald-500",
  Rejected:  "bg-red-400",
};

export default function AnalyticsWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalyticsSummary,
  });

  if (isLoading) return null;
  if (!data || data.total === 0) return null;

  const statusEntries = Object.entries(data.status_breakdown);
  const sourceEntries = Object.entries(data.source_breakdown)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  return (
    <div className="space-y-4">

      {/* Insight banner */}
      {data.best_source && (
        <div className="rounded-xl bg-indigo-950 border border-indigo-900 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-indigo-400 uppercase tracking-wide">Top performing source</p>
            <p className="text-sm font-semibold text-white mt-0.5">
              {data.best_source} — {data.source_breakdown[data.best_source]?.rate}% interview rate
            </p>
          </div>
          <span className="text-2xl">🏆</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Status breakdown */}
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Pipeline breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {statusEntries.map(([status, count]) => {
              const pct = Math.round(count / data.total * 100);
              return (
                <div key={status}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{status}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${STATUS_COLORS[status] ?? "bg-slate-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Source performance */}
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Source performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sourceEntries.map(([source, stats]) => (
              <div key={source} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-700">{source}</p>
                  <p className="text-xs text-slate-400">{stats.total} applications</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-700">{stats.rate}%</p>
                  <p className="text-xs text-slate-400">interview rate</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>

      {/* Avg days + rates */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-none">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{data.response_rate}%</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">Response rate</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{data.interview_rate}%</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">Interview rate</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">
              {data.avg_days_to_response ?? "—"}
            </p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">Avg days</p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}