import { api } from "../lib/api";

export interface Activity {
  id: number;
  application_id: number;
  event: string;
  detail: string | null;
  created_at: string;
}

export function getActivities(): Promise<Activity[]> {
  return api.get<Activity[]>("/activities");
}

export function getApplicationActivities(appId: number): Promise<Activity[]> {
  return api.get<Activity[]>(`/activities/application/${appId}`);
}