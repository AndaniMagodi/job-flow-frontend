import { useQuery } from "@tanstack/react-query";
import { getDueApplications } from "../api/application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function getDueBadge(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0)   return { label: `${Math.abs(diff)}d overdue`, className: "bg-red-50 text-red-700 hover:bg-red-50" };
  if (diff === 0) return { label: "Due today",                   className: "bg-amber-50 text-amber-700 hover:bg-amber-50" };
  return           { label: `Due in ${diff}d`,                   className: "bg-blue-50 text-blue-700 hover:bg-blue-50" };
}

export default function ActionCentre() {
  const { data: due, isLoading } = useQuery({
    queryKey: ["applications-due"],
    queryFn: getDueApplications,
  });

  if (isLoading) return null;
  if (!due || due.length === 0) return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-700">Action centre</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-400">No follow-ups due. You're all caught up!</p>
      </CardContent>
    </Card>
  );

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-700">
          Action centre
          <span className="ml-2 text-xs font-normal text-slate-400">
            {due.length} need{due.length === 1 ? "s" : ""} attention
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {due.map((app) => {
          const badge = getDueBadge(app.follow_up_date!);
          return (
            <div key={app.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-slate-800">{app.role}</p>
                <p className="text-xs text-slate-400">{app.company}</p>
              </div>
              <Badge className={badge.className}>{badge.label}</Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}