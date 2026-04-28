export interface ResumeAnalysis {
  id: string;
  timestamp: number;
  company: string;
  jobTitle: string;
  overall_score: number;
  ats_tips: string[];
  tone_analysis: string;
  content_suggestions: string[];
  skill_gap_analysis: string[];
}

export interface UserProfile {
  username: string;
}

declare global {
  interface Window {
    puter: any;
  }
}
