import type { Timestamp } from "firebase/firestore";

// ── Shared application status constants ───────────────────────────────────────
export const JobStatus = {
  APPLIED:   "Applied",
  INTERVIEW: "Interview",
  OFFER:     "Offer",
  REJECTED:  "Rejected",
  HIRED:     "Hired",
} as const;

export type JobStatusValue = (typeof JobStatus)[keyof typeof JobStatus];

// ── Core JobApplication shape (Firestore / Home) ──────────────────────────────
export interface JobApplication {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  status: JobStatusValue | string;
  dateApplied: string;
  jobUrl?: string;
  description?: string;
  notes?: string;
  /** ISO date string for an upcoming interview, e.g. "2025-03-15" */
  interviewDate?: string;
  userId?: string;
  createdAt?: Timestamp;
}

// ── Shape CalendarView expects ────────────────────────────────────────────────
export interface CalendarApplication {
  id: string;
  job_title: string;
  company_name: string;
  status: string;
  applied_date: string;
  interview_date?: string;
}

// ── Helper: map Home's JobApplication → CalendarApplication ──────────────────
export function toCalendarApp(job: JobApplication): CalendarApplication {
  return {
    id:            job.id,
    job_title:     job.title,
    company_name:  job.company,
    status:        job.status,
    applied_date:  job.dateApplied,
    interview_date: job.interviewDate,
  };
}

// ── Dashboard stats shape ─────────────────────────────────────────────────────
export interface DashboardStats {
  applied:    number;
  interviews: number;
  offers:     number;
  rejected:   number;
}