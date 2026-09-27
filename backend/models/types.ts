export type UserRole = "client" | "lawyer" | "admin";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  status: "active" | "pending" | "suspended";
  createdAt: string;
  updatedAt?: string;
}

export interface ILawyerProfile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  categories: string[];
  experience: number; // in years
  location: string;
  languages: string[];
  education: string;
  bio: string;
  consultationFee: number; // in USD
  consultationModes: ("Video Call" | "Phone Call" | "In-Person")[];
  availability: string[]; // e.g. ["Mon-Fri 09:00 - 17:00", "Weekend by request"]
  verificationStatus: "verified" | "pending" | "rejected";
  avatarUrl: string;
  ratingAverage?: number;
  consultationCount?: number;
  isDemo: boolean;
  createdAt: string;
}

export type ConsultationStatus = "Pending" | "Accepted" | "Rejected" | "Completed" | "Cancelled";

export interface IConsultationRequest {
  _id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  lawyerId: string;
  lawyerName: string;
  category: string;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
  mode: "Video Call" | "Phone Call" | "In-Person";
  status: ConsultationStatus;
  notes?: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CaseStatus = "New" | "Consultation" | "Active" | "Waiting for Documents" | "Closed";

export interface ICaseTimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface ICase {
  _id: string;
  clientId: string;
  clientName: string;
  lawyerId: string;
  lawyerName: string;
  title: string;
  category: string;
  description: string;
  status: CaseStatus;
  nextAction: string;
  notes: string;
  timeline: ICaseTimelineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface IDocument {
  _id: string;
  caseId?: string;
  consultationId?: string;
  clientId: string;
  clientName: string;
  lawyerId?: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileUrl: string; // data URI or simulated link
  uploadedBy: "client" | "lawyer";
  createdAt: string;
}

export interface IAIClassification {
  _id: string;
  clientId?: string;
  problemDescription: string;
  category: string;
  subCategory: string;
  summary: string;
  confidence: number;
  disclaimer: string;
  createdAt: string;
}
