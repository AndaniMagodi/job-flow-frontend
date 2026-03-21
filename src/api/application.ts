import type { JobApplication } from "../types/application";
import { loadApplications, saveApplications } from "../lib/storage";

export async function getApplications(): Promise<JobApplication[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const applications = loadApplications();
      resolve(applications);
    }, 300);
  });
}

export type CreateApplicationInput = {
  company: string;
  role: string;
  status?: JobApplication["status"];
  dateApplied?: string;
  link?: string;
  notes?: string;
};

export async function createApplication(
  input: CreateApplicationInput,
): Promise<JobApplication> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingApplications = loadApplications();
      const highestExistingId = existingApplications.reduce(
        (maxId, application) => Math.max(maxId, application.id),
        0,
      );
      const nextId = highestExistingId + 1;

      const newApplication: JobApplication = {
        id: nextId,
        company: input.company.trim(),
        role: input.role.trim(),
        status: input.status ?? "Applied",
        dateApplied: input.dateApplied ?? new Date().toISOString().slice(0, 10),
        link: input.link?.trim() || undefined,
        notes: input.notes?.trim() || undefined,
      };

      const updatedApplications = [newApplication, ...existingApplications];
      saveApplications(updatedApplications);

      resolve(newApplication);
    }, 200);
  });
}