import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { seedDatabaseIfEmpty } from "./backend/services/seedService.ts";

// Import API routers
import authRoutes from "./backend/routes/authRoutes.ts";
import lawyerRoutes from "./backend/routes/lawyerRoutes.ts";
import consultationRoutes from "./backend/routes/consultationRoutes.ts";
import caseRoutes from "./backend/routes/caseRoutes.ts";
import documentRoutes from "./backend/routes/documentRoutes.ts";
import aiRoutes from "./backend/routes/aiRoutes.ts";
import adminRoutes from "./backend/routes/adminRoutes.ts";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Basic middlewares
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Seed demo data on launch
  await seedDatabaseIfEmpty();

  // API Routes
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      success: true,
      service: "LegalConnect LegalTech API",
      status: "operational",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/lawyers", lawyerRoutes);
  app.use("/api/consultations", consultationRoutes);
  app.use("/api/cases", caseRoutes);
  app.use("/api/documents", documentRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/admin", adminRoutes);

  // Global API Error Handler
  app.use("/api/*", (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("API Error encountered:", err);
    res.status(500).json({
      success: false,
      message: err?.message || "Internal server error occurred.",
    });
  });

  // Vite middleware for development vs Static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LegalConnect server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
