import { api } from "../lib/api";

export interface DiscoveredJob {
  job_title: string;
  company: string;
  location: string;
  is_remote: boolean;
  apply_link: string;
  match_score: number;
  match_reason: string;
  apply_priority: "high" | "medium" | "low";
  date_posted: string;
}

export interface DiscoverResponse {
  profile: {
    total_applications: number;
    roles_applied_for: string[];
    response_rate: number;
    best_source: string | null;
  };
  jobs: DiscoveredJob[];
  total: number;
}

export function discoverJobs(): Promise<DiscoverResponse> {
  return api.get<DiscoverResponse>("/discover/jobs");
}