export const generationTypes = [
  "ats_resume",
  "cover_letter",
  "linkedin_summary",
  "recruiter_message",
  "interview_prep",
  "translate_resume"
] as const;

export type GenerationType = (typeof generationTypes)[number];

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  plan: string;
  is_admin: boolean;
  is_blocked: boolean;
};

export type Generation = {
  id: string;
  user_id: string;
  type: GenerationType;
  language: string;
  target_country: string;
  job_description: string | null;
  input_resume: string;
  output: string;
  created_at: string;
};
