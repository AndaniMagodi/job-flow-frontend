import { api } from "../lib/api";
import type { AIStatus, JobMatchResult, SmartSearchResult } from "../types/job";

export async function getAIStatus(): Promise<AIStatus> {
  return api.get<AIStatus>("/ai/status");
}

export async function smartSearch(query: string): Promise<SmartSearchResult> {
  return api.post<SmartSearchResult>("/ai/search", { query });
}

export async function matchCVToJob(
  jobId: number,
  cvText: string
): Promise<JobMatchResult> {
  return api.post<JobMatchResult>("/ai/match", {
    job_id: jobId,
    cv_text: cvText,
  });
}
