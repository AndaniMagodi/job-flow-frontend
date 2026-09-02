import { api } from "../lib/api";
import type {
  Job,
  JobFacets,
  JobFilters,
  JobList,
  SalaryBenchmark,
  SavedJob,
} from "../types/job";
import type { JobApplication } from "../types/application";

function toQueryString(filters: JobFilters): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    // An unset filter must not become "undefined" in the query string.
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function browseJobs(filters: JobFilters = {}): Promise<JobList> {
  return api.get<JobList>(`/jobs${toQueryString(filters)}`);
}

export async function getJob(id: number): Promise<Job> {
  return api.get<Job>(`/jobs/${id}`);
}

export async function getJobFacets(): Promise<JobFacets> {
  return api.get<JobFacets>("/jobs/facets");
}

export async function getSavedJobs(): Promise<SavedJob[]> {
  return api.get<SavedJob[]>("/jobs/saved");
}

export async function saveJob(id: number): Promise<SavedJob> {
  return api.post<SavedJob>(`/jobs/${id}/save`, {});
}

export async function unsaveJob(id: number): Promise<void> {
  return api.delete(`/jobs/${id}/save`);
}

/**
 * Records the application in the tracker. The caller is responsible for
 * sending the user to the original posting — we never host the apply flow.
 */
export async function applyToJob(id: number): Promise<JobApplication> {
  return api.post<JobApplication>(`/jobs/${id}/apply`, {});
}

export async function getSalaryEstimate(
  jobId: number
): Promise<SalaryBenchmark | null> {
  try {
    return await api.get<SalaryBenchmark>(`/jobs/${jobId}/salary-estimate`);
  } catch {
    // A 404 here is the normal case — the listing states its own salary, or
    // there aren't enough comparable adverts to say anything useful.
    return null;
  }
}
