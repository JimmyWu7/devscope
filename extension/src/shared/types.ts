export interface User {
  id: string;
  name: string;
  email: string;
}

export type Status = "idle" | "connected" | "syncing" | "error";

export type ThemeMode = "system" | "light" | "dark";

export interface JobApplication {
  company: string;
  role: string;
  location: string;
  salary: string;
  salaryMin: string;
  salaryMax: string;
  dateApplied: string;
  datePosted: string;
  applicationUrl: string;
  notes: string;
}

export interface StorageData {
  devscopeToken?: string;
  devscopeUser?: User;
  devscopeStatus?: Status;
  themeMode?: ThemeMode; 
  privacyMode?: boolean;
}
