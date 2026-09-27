import {
  User,
  LawyerProfile,
  ConsultationRequest,
  CaseItem,
  DocumentItem,
  AIClassificationResult,
  LegalCategoryInfo,
} from "../types.ts";

const TOKEN_KEY = "legalconnect_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  async register(payload: any): Promise<{ success: boolean; token: string; user: User }> {
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async login(payload: { email: string; password: string }): Promise<{ success: boolean; token: string; user: User }> {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getMe(): Promise<{ success: boolean; user: User & { lawyerProfile?: LawyerProfile } }> {
    return request("/api/auth/me");
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Lawyers
  async getLawyers(params: Record<string, any> = {}): Promise<{ success: boolean; count: number; lawyers: LawyerProfile[] }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        query.append(key, String(val));
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : "";
    return request(`/api/lawyers${qs}`);
  },

  async getLawyerById(id: string): Promise<{ success: boolean; lawyer: LawyerProfile }> {
    return request(`/api/lawyers/${id}`);
  },

  async updateLawyerProfile(id: string, updates: Partial<LawyerProfile>): Promise<{ success: boolean; lawyer: LawyerProfile }> {
    return request(`/api/lawyers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  // AI Classification
  async classifyProblem(problemDescription: string): Promise<{
    success: boolean;
    classification: AIClassificationResult;
    isLowConfidence: boolean;
    matchingLawyers: LawyerProfile[];
    totalMatches: number;
  }> {
    return request("/api/ai/classify", {
      method: "POST",
      body: JSON.stringify({ problemDescription }),
    });
  },

  // Consultations
  async requestConsultation(payload: {
    lawyerId: string;
    category: string;
    problemDescription: string;
    preferredDate: string;
    preferredTime: string;
    mode: string;
    notes?: string;
  }): Promise<{ success: boolean; consultation: ConsultationRequest }> {
    return request("/api/consultations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getMyConsultations(): Promise<{ success: boolean; consultations: ConsultationRequest[] }> {
    return request("/api/consultations/my");
  },

  async getConsultationById(id: string): Promise<{ success: boolean; consultation: ConsultationRequest }> {
    return request(`/api/consultations/${id}`);
  },

  async updateConsultationStatus(id: string, status: string, notes?: string): Promise<{ success: boolean; consultation: ConsultationRequest }> {
    return request(`/api/consultations/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    });
  },

  // Cases
  async getCases(): Promise<{ success: boolean; cases: CaseItem[] }> {
    return request("/api/cases");
  },

  async getCaseById(id: string): Promise<{ success: boolean; case: CaseItem }> {
    return request(`/api/cases/${id}`);
  },

  async createCase(payload: {
    clientId: string;
    title: string;
    category: string;
    description: string;
    nextAction?: string;
    notes?: string;
  }): Promise<{ success: boolean; case: CaseItem }> {
    return request("/api/cases", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateCase(id: string, updates: Partial<CaseItem>): Promise<{ success: boolean; case: CaseItem }> {
    return request(`/api/cases/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  // Documents
  async getDocuments(caseId?: string): Promise<{ success: boolean; documents: DocumentItem[] }> {
    const qs = caseId ? `?caseId=${caseId}` : "";
    return request(`/api/documents${qs}`);
  },

  async uploadDocument(payload: {
    caseId?: string;
    consultationId?: string;
    fileName: string;
    fileType: string;
    fileSize?: string;
    fileUrl?: string;
  }): Promise<{ success: boolean; document: DocumentItem }> {
    return request("/api/documents", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async deleteDocument(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/api/documents/${id}`, {
      method: "DELETE",
    });
  },

  // Admin
  async getAdminStats(): Promise<{
    success: boolean;
    stats: {
      totalUsers: number;
      totalLawyers: number;
      pendingApprovals: number;
      totalConsultations: number;
      activeCases: number;
    };
  }> {
    return request("/api/admin/stats");
  },

  async getAdminUsers(): Promise<{ success: boolean; users: User[] }> {
    return request("/api/admin/users");
  },

  async toggleUserStatus(id: string, status: string): Promise<{ success: boolean; user: User }> {
    return request(`/api/admin/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async setLawyerVerification(id: string, verificationStatus: string): Promise<{ success: boolean; lawyer: LawyerProfile }> {
    return request(`/api/admin/lawyers/${id}/verification`, {
      method: "PATCH",
      body: JSON.stringify({ verificationStatus }),
    });
  },

  async getCategories(): Promise<{ success: boolean; categories: LegalCategoryInfo[] }> {
    return request("/api/admin/categories");
  },
};
