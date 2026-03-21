import { mockApplications } from "../data/Application";
import type { JobApplication } from "../types/application";

export async function getApplications(): Promise<JobApplication[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockApplications), 300);
  });
}