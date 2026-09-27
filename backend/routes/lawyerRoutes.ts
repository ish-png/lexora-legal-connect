import { Router } from "express";
import { getLawyers, getLawyerById, updateLawyerProfile } from "../controllers/lawyerController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";

const router = Router();

router.get("/", getLawyers);
router.get("/:id", getLawyerById);
router.patch("/:id", authenticateToken, updateLawyerProfile);

export default router;
