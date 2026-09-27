import { dbStore } from "../config/db.ts";
import {
  IUser,
  ILawyerProfile,
  IConsultationRequest,
  ICase,
  IDocument,
  IAIClassification,
} from "./types.ts";

function generateId(): string {
  return "id_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

// User Model Repository
export const UserModel = {
  async find(filter?: Partial<IUser>): Promise<IUser[]> {
    await dbStore.load();
    let list = dbStore.getData().users;
    if (!filter) return list;
    return list.filter((item) => {
      for (const key in filter) {
        if ((item as any)[key] !== (filter as any)[key]) return false;
      }
      return true;
    });
  },

  async findById(id: string): Promise<IUser | null> {
    await dbStore.load();
    const user = dbStore.getData().users.find((u) => u._id === id);
    return user || null;
  },

  async findOne(filter: Partial<IUser>): Promise<IUser | null> {
    const list = await this.find(filter);
    return list[0] || null;
  },

  async create(data: Omit<IUser, "_id" | "createdAt">): Promise<IUser> {
    await dbStore.load();
    const user: IUser = {
      ...data,
      _id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dbStore.getData().users.push(user);
    dbStore.save();
    return user;
  },

  async updateById(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    await dbStore.load();
    const list = dbStore.getData().users;
    const index = list.findIndex((u) => u._id === id);
    if (index === -1) return null;
    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    dbStore.save();
    return list[index];
  },

  async deleteById(id: string): Promise<boolean> {
    await dbStore.load();
    const list = dbStore.getData().users;
    const initialLen = list.length;
    dbStore.getData().users = list.filter((u) => u._id !== id);
    if (dbStore.getData().users.length !== initialLen) {
      dbStore.save();
      return true;
    }
    return false;
  },
};

// LawyerProfile Model Repository
export const LawyerProfileModel = {
  async find(filter?: {
    category?: string;
    location?: string;
    specialization?: string;
    verificationStatus?: string;
    search?: string;
    minExp?: number;
    maxFee?: number;
    language?: string;
    mode?: string;
  }): Promise<ILawyerProfile[]> {
    await dbStore.load();
    let list = dbStore.getData().lawyerProfiles;

    if (!filter) return list;

    return list.filter((lawyer) => {
      if (filter.verificationStatus && lawyer.verificationStatus !== filter.verificationStatus) {
        return false;
      }
      if (filter.category) {
        const matchesCat = lawyer.categories.some(
          (c) => c.toLowerCase() === filter.category!.toLowerCase()
        );
        if (!matchesCat) return false;
      }
      if (filter.location && !lawyer.location.toLowerCase().includes(filter.location.toLowerCase())) {
        return false;
      }
      if (filter.minExp && lawyer.experience < filter.minExp) {
        return false;
      }
      if (filter.maxFee && lawyer.consultationFee > filter.maxFee) {
        return false;
      }
      if (filter.language && !lawyer.languages.some((l) => l.toLowerCase() === filter.language!.toLowerCase())) {
        return false;
      }
      if (filter.mode && !lawyer.consultationModes.some((m) => m.toLowerCase().includes(filter.mode!.toLowerCase()))) {
        return false;
      }
      if (filter.search) {
        const q = filter.search.toLowerCase();
        const matchesName = lawyer.name.toLowerCase().includes(q);
        const matchesSpec = lawyer.specialization.toLowerCase().includes(q);
        const matchesLoc = lawyer.location.toLowerCase().includes(q);
        const matchesBio = lawyer.bio.toLowerCase().includes(q);
        const matchesCategory = lawyer.categories.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesSpec && !matchesLoc && !matchesBio && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  },

  async findById(id: string): Promise<ILawyerProfile | null> {
    await dbStore.load();
    const item = dbStore.getData().lawyerProfiles.find((l) => l._id === id);
    return item || null;
  },

  async findByUserId(userId: string): Promise<ILawyerProfile | null> {
    await dbStore.load();
    const item = dbStore.getData().lawyerProfiles.find((l) => l.userId === userId);
    return item || null;
  },

  async create(data: Omit<ILawyerProfile, "_id" | "createdAt">): Promise<ILawyerProfile> {
    await dbStore.load();
    const profile: ILawyerProfile = {
      ...data,
      _id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dbStore.getData().lawyerProfiles.push(profile);
    dbStore.save();
    return profile;
  },

  async updateById(id: string, updates: Partial<ILawyerProfile>): Promise<ILawyerProfile | null> {
    await dbStore.load();
    const list = dbStore.getData().lawyerProfiles;
    const index = list.findIndex((l) => l._id === id);
    if (index === -1) return null;
    list[index] = {
      ...list[index],
      ...updates,
    };
    dbStore.save();
    return list[index];
  },
};

// ConsultationRequest Model Repository
export const ConsultationRequestModel = {
  async find(filter?: {
    clientId?: string;
    lawyerId?: string;
    status?: string;
  }): Promise<IConsultationRequest[]> {
    await dbStore.load();
    let list = dbStore.getData().consultationRequests;
    if (!filter) return list;
    return list.filter((r) => {
      if (filter.clientId && r.clientId !== filter.clientId) return false;
      if (filter.lawyerId && r.lawyerId !== filter.lawyerId) return false;
      if (filter.status && r.status !== filter.status) return false;
      return true;
    });
  },

  async findById(id: string): Promise<IConsultationRequest | null> {
    await dbStore.load();
    const item = dbStore.getData().consultationRequests.find((r) => r._id === id);
    return item || null;
  },

  async create(data: Omit<IConsultationRequest, "_id" | "createdAt">): Promise<IConsultationRequest> {
    await dbStore.load();
    const item: IConsultationRequest = {
      ...data,
      _id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dbStore.getData().consultationRequests.unshift(item);
    dbStore.save();
    return item;
  },

  async updateById(id: string, updates: Partial<IConsultationRequest>): Promise<IConsultationRequest | null> {
    await dbStore.load();
    const list = dbStore.getData().consultationRequests;
    const index = list.findIndex((r) => r._id === id);
    if (index === -1) return null;
    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    dbStore.save();
    return list[index];
  },
};

// Case Model Repository
export const CaseModel = {
  async find(filter?: { clientId?: string; lawyerId?: string; status?: string }): Promise<ICase[]> {
    await dbStore.load();
    let list = dbStore.getData().cases;
    if (!filter) return list;
    return list.filter((c) => {
      if (filter.clientId && c.clientId !== filter.clientId) return false;
      if (filter.lawyerId && c.lawyerId !== filter.lawyerId) return false;
      if (filter.status && c.status !== filter.status) return false;
      return true;
    });
  },

  async findById(id: string): Promise<ICase | null> {
    await dbStore.load();
    const item = dbStore.getData().cases.find((c) => c._id === id);
    return item || null;
  },

  async create(data: Omit<ICase, "_id" | "createdAt" | "updatedAt">): Promise<ICase> {
    await dbStore.load();
    const item: ICase = {
      ...data,
      _id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dbStore.getData().cases.unshift(item);
    dbStore.save();
    return item;
  },

  async updateById(id: string, updates: Partial<ICase>): Promise<ICase | null> {
    await dbStore.load();
    const list = dbStore.getData().cases;
    const index = list.findIndex((c) => c._id === id);
    if (index === -1) return null;
    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    dbStore.save();
    return list[index];
  },
};

// Document Model Repository
export const DocumentModel = {
  async find(filter?: { caseId?: string; clientId?: string; lawyerId?: string }): Promise<IDocument[]> {
    await dbStore.load();
    let list = dbStore.getData().documents;
    if (!filter) return list;
    return list.filter((d) => {
      if (filter.caseId && d.caseId !== filter.caseId) return false;
      if (filter.clientId && d.clientId !== filter.clientId) return false;
      if (filter.lawyerId && d.lawyerId !== filter.lawyerId) return false;
      return true;
    });
  },

  async findById(id: string): Promise<IDocument | null> {
    await dbStore.load();
    const item = dbStore.getData().documents.find((d) => d._id === id);
    return item || null;
  },

  async create(data: Omit<IDocument, "_id" | "createdAt">): Promise<IDocument> {
    await dbStore.load();
    const item: IDocument = {
      ...data,
      _id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dbStore.getData().documents.unshift(item);
    dbStore.save();
    return item;
  },

  async deleteById(id: string): Promise<boolean> {
    await dbStore.load();
    const list = dbStore.getData().documents;
    const initialLen = list.length;
    dbStore.getData().documents = list.filter((d) => d._id !== id);
    if (dbStore.getData().documents.length !== initialLen) {
      dbStore.save();
      return true;
    }
    return false;
  },
};

// AI Classification Repository
export const AIClassificationModel = {
  async create(data: Omit<IAIClassification, "_id" | "createdAt">): Promise<IAIClassification> {
    await dbStore.load();
    const item: IAIClassification = {
      ...data,
      _id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dbStore.getData().classifications.unshift(item);
    dbStore.save();
    return item;
  },

  async find(filter?: { clientId?: string }): Promise<IAIClassification[]> {
    await dbStore.load();
    let list = dbStore.getData().classifications;
    if (filter?.clientId) {
      list = list.filter((c) => c.clientId === filter.clientId);
    }
    return list;
  },
};
