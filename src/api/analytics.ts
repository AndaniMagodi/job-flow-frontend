import { api } from "../lib/api";

export interface SourceStat {
  total: number;
  interviews: number;
  offers: number;
  rate: number;
}

export interface AnalyticsSummary {
  total: number;
  response_rate: number;
  interview_rate: number;
  status_breakdown: Record<string, number>;
  source_breakdown: Record<string, SourceStat>;
  avg_days_to_response: number | null;
  best_source: string | null;
}

export function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  return api.get<AnalyticsSummary>("/analytics/summary");
}