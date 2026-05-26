export type ResumeTemplateKey = "classic" | "professional" | "modern";

export type ResumePersonal = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  links: string;
};

export type ResumeExperience = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
};

export type ResumeEducation = {
  id: string;
  degree: string;
  school: string;
  location: string;
  start: string;
  end: string;
  description: string;
};

export type ResumeCertification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  description: string;
};

export type ResumeData = {
  language: string;
  targetRole: string;
  targetJobDescription: string;
  template: ResumeTemplateKey;
  primaryColor: string;
  personal: ResumePersonal;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  certifications: ResumeCertification[];
  skills: string[];
};

export type ResumeRecord = {
  id: string;
  user_id: string;
  title: string;
  data: ResumeData;
  created_at: string;
  updated_at: string;
};
