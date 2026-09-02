import type { ApplicationStatus } from "../types/application";

/**
 * Pipeline status colours, validated for colour-vision deficiency against a
 * white surface. The green/red pair (Offer vs Rejected) sits in the CVD floor
 * band, which is only legal because every status mark is also directly
 * labelled — never remove the text label beside a status colour.
 */
export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Applied: "#4f46e5",
  Interview: "#0284c7",
  Offer: "#047857",
  Rejected: "#be123c",
};

export const STATUS_SOFT: Record<ApplicationStatus, string> = {
  Applied: "#eef2ff",
  Interview: "#e0f2fe",
  Offer: "#ecfdf5",
  Rejected: "#fff1f2",
};

export const STATUS_ORDER: ApplicationStatus[] = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

export function statusColor(status: string): string {
  return STATUS_COLORS[status as ApplicationStatus] ?? "#64748b";
}

export function statusSoft(status: string): string {
  return STATUS_SOFT[status as ApplicationStatus] ?? "#f4f5f8";
}
