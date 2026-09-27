import { Router } from "express";
import {
  createConsultation,
  getMyConsultations,
  getConsultationById,
  updateConsultationStatus,
} from "../controllers/consultationController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";

const router = Router();

router.post("/", authenticateToken, createConsultation);
router.get("/my", authenticateToken, getMyConsultations);
router.get("/:id", authenticateToken, getConsultationById);
router.patch("/:id/status", authenticateToken, updateConsultationStatus);

export default router;
