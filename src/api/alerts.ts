import { api } from "../lib/api";
import type {
  AlertChannels,
  AlertPreview,
  JobAlert,
  JobFilters,
} from "../types/job";

export async function getAlertChannels(): Promise<AlertChannels> {
  return api.get<AlertChannels>("/alerts/channels");
}

export async function getAlerts(): Promise<JobAlert[]> {
  return api.get<JobAlert[]>("/alerts");
}

export async function createAlert(input: {
  name: string;
  filters: JobFilters;
  destination: string;
  channel?: string;
}): Promise<JobAlert> {
  return api.post<JobAlert>("/alerts", { channel: "whatsapp", ...input });
}

export async function updateAlert(
  id: number,
  patch: Partial<{ name: string; filters: JobFilters; destination: string; is_active: boolean }>
): Promise<JobAlert> {
  return api.patch<JobAlert>(`/alerts/${id}`, patch);
}

export async function deleteAlert(id: number): Promise<void> {
  return api.delete(`/alerts/${id}`);
}

export async function previewAlert(id: number): Promise<AlertPreview> {
  return api.post<AlertPreview>(`/alerts/${id}/preview`, {});
}
