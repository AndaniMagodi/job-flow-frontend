import { api } from "../lib/api";
import type { JobApplication } from "../types/application";

export type CreateApplicationInput = {
  company: string;
  role: string;
  status?: JobApplication["status"];
  date_applied?: string;
  link?: string;
  notes?: string;
};

export async function getApplications(): Promise<JobApplication[]> {
  return api.get<JobApplication[]>("/applications");
}

export async function createApplication(
  input: CreateApplicationInput
): Promise<JobApplication> {
  return api.post<JobApplication>("/applications", input);
}

export async function updateApplicationStatus(
  id: number,
  status: JobApplication["status"]
): Promise<JobApplication> {
  return api.patch<JobApplication>(`/applications/${id}/status`, { status });
}

export async function deleteApplication(id: number): Promise<void> {
  return api.delete(`/applications/${id}`);
}

export async function setFollowUpDate(
  id: number,
  follow_up_date: string
): Promise<JobApplication> {
  return api.patch<JobApplication>(`/applications/${id}/follow-up`, { follow_up_date });
}

export async function getDueApplications(): Promise<JobApplication[]> {
  return api.get<JobApplication[]>("/applications/due");
}