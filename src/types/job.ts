export type Job = {
  id: number;
  source: string;
  apply_url: string;
  title: string;
  company: string;
  description?: string | null;
  description_is_truncated: boolean;
  location?: string | null;
  province?: string | null;
  is_remote: boolean;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency: string;
  salary_is_predicted: boolean;
  salary_period?: string | null;
  category?: string | null;
  contract_type?: string | null;
  experience_level?: string | null;
  opportunity_type: OpportunityType;
  no_experience_required: boolean;
  posted_at?: string | null;
};

export type OpportunityType =
  | "Job"
  | "Learnership"
  | "Internship"
  | "Graduate programme"
  | "Apprenticeship";

/** An estimate from comparable adverts — never the employer's own figure. */
export type SalaryBenchmark = {
  p25: number;
  median: number;
  p75: number;
  sample_size: number;
  basis: string;
  cohort: string;
  confidence: "high" | "medium" | "low";
};

export type JobList = {
  items: Job[];
  total: number;
  page: number;
  page_size: number;
};

export type JobFacets = {
  provinces: string[];
  categories: string[];
  experience_levels: string[];
  contract_types: string[];
  opportunity_types: string[];
};

export type SavedJob = {
  id: number;
  job: Job;
  created_at: string;
};

/** Filters the browse page sends to the API. All optional. */
export type JobFilters = {
  q?: string;
  province?: string;
  is_remote?: boolean;
  category?: string;
  experience_level?: string;
  contract_type?: string;
  salary_min?: number;
  salary_max?: number;
  opportunity_type?: string;
  no_experience_required?: boolean;
  page?: number;
  page_size?: number;
};

/** What the LLM understood from a plain-English search. */
export type SearchFilters = {
  keywords?: string | null;
  province?: string | null;
  is_remote?: boolean | null;
  salary_min?: number | null;
  salary_max?: number | null;
  category?: string | null;
  experience_level?: string | null;
  contract_type?: string | null;
  interpretation: string;
};

export type SmartSearchResult = {
  filters: SearchFilters;
  items: Job[];
  total: number;
};

export type JobMatchResult = {
  match_score: number;
  verdict: "Strong match" | "Good match" | "Partial match" | "Weak match";
  summary: string;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
};

export type AIStatus = {
  available: boolean;
  model?: string | null;
};

export type JobAlert = {
  id: number;
  name: string;
  filters: JobFilters;
  channel: string;
  destination: string;
  is_active: boolean;
  last_notified_at?: string | null;
  created_at: string;
};

export type AlertPreview = {
  alert_id: number;
  matched: number;
  sent: boolean;
  preview?: string;
};

export type AlertChannels = {
  available: string[];
  fallback_to_console: boolean;
};
