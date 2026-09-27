import fs from "fs";
import path from "path";
import {
  IUser,
  ILawyerProfile,
  IConsultationRequest,
  ICase,
  IDocument,
  IAIClassification,
} from "../models/types.ts";

interface DatabaseSchema {
  users: IUser[];
  lawyerProfiles: ILawyerProfile[];
  consultationRequests: IConsultationRequest[];
  cases: ICase[];
  documents: IDocument[];
  classifications: IAIClassification[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "database.json");

class LocalDataStore {
  private data: DatabaseSchema = {
    users: [],
    lawyerProfiles: [],
    consultationRequests: [],
    cases: [],
    documents: [],
    classifications: [],
  };
  private isLoaded = false;

  constructor() {
    this.ensureDataDir();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  public async load(): Promise<DatabaseSchema> {
    if (this.isLoaded) return this.data;
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(raw);
      }
    } catch (err) {
      console.warn("Could not read local database file, initializing clean memory state:", err);
    }
    this.isLoaded = true;
    return this.data;
  }

  public save(): void {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving database state to disk:", err);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public resetData(newData: DatabaseSchema) {
    this.data = newData;
    this.isLoaded = true;
    this.save();
  }
}

export const dbStore = new LocalDataStore();
