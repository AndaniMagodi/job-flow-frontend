import type { JobApplication } from "../types/application";

export const mockApplications: JobApplication[] = [
  {
    id: 1,
    company: "Electrum",
    role: "Junior Software Developer",
    status: "Applied",
    dateApplied: "2026-03-10",
    link: "https://example.com/job/1",
    notes: "Applied through company website.",
  },
  {
    id: 2,
    company: "FirstRand",
    role: "Developer",
    status: "Interview",
    dateApplied: "2026-03-12",
    link: "https://example.com/job/2",
    notes: "Application still under review.",
  },
  {
    id: 3,
    company: "Remote Web Co",
    role: "Frontend Developer",
    status: "Rejected",
    dateApplied: "2026-03-08",
    notes: "Need stronger portfolio.",
  },
];