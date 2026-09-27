export type UserRole = "client" | "lawyer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: "active" | "pending" | "suspended";
  createdAt?: string;
  lawyerProfileId?: string;
}

export interface LawyerProfile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  categories: string[];
  experience: number;
  location: string;
  languages: string[];
  education: string;
  bio: string;
  consultationFee: number;
  consultationModes: ("Video Call" | "Phone Call" | "In-Person")[];
  availability: string[];
  verificationStatus: "verified" | "pending" | "rejected";
  avatarUrl: string;
  ratingAverage?: number;
  consultationCount?: number;
  isDemo: boolean;
  createdAt: string;
}

export type ConsultationStatus = "Pending" | "Accepted" | "Rejected" | "Completed" | "Cancelled";

export interface ConsultationRequest {
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

export interface CaseTimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface CaseItem {
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
  timeline: CaseTimelineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  _id: string;
  caseId?: string;
  consultationId?: string;
  clientId: string;
  clientName: string;
  lawyerId?: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileUrl: string;
  uploadedBy: "client" | "lawyer";
  createdAt: string;
}

export interface AIClassificationResult {
  category: string;
  subCategory: string;
  summary: string;
  confidence: number;
  disclaimer: string;
}

export interface LegalCategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  lawyerCount?: number;
}
