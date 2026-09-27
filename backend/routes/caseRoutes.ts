import { Router } from "express";
import {
  createCase,
  getCases,
  getCaseById,
  updateCase,
} from "../controllers/caseController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";

const router = Router();

router.post("/", authenticateToken, createCase);
router.get("/", authenticateToken, getCases);
router.get("/:id", authenticateToken, getCaseById);
router.patch("/:id", authenticateToken, updateCase);

export default router;
