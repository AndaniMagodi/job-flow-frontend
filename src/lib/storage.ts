import { mockApplications } from "../data/Application";
import type { JobApplication } from "../types/application";

const APPLICATIONS_STORAGE_KEY = "job-tracker-applications";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadApplications(): JobApplication[] {
  if (!canUseStorage()) {
    return mockApplications;
  }

  const rawApplications = window.localStorage.getItem(APPLICATIONS_STORAGE_KEY);

  if (!rawApplications) {
    window.localStorage.setItem(
      APPLICATIONS_STORAGE_KEY,
      JSON.stringify(mockApplications),
    );
    return mockApplications;
  }

  try {
    const parsedApplications = JSON.parse(rawApplications) as JobApplication[];
    return parsedApplications;
  } catch {
    window.localStorage.setItem(
      APPLICATIONS_STORAGE_KEY,
      JSON.stringify(mockApplications),
    );
    return mockApplications;
  }
}

export function saveApplications(applications: JobApplication[]): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    APPLICATIONS_STORAGE_KEY,
    JSON.stringify(applications),
  );
}
