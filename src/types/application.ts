export type ApplicationStatus =
  | "Applied"
  | "Interview"
  | "Rejected"
  | "Offer";

export type JobApplication = {
  id: number;
  company: string;
  role: string;
  status: ApplicationStatus;
  date_applied: string;
  follow_up_date?: string | null;
  link?: string;
  notes?: string;
};