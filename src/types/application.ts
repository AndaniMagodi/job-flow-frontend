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
  dateApplied: string;
  link?: string;
  notes?: string;
};