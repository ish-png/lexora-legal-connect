import { Router } from "express";
import {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  setLawyerVerification,
  getCategories,
} from "../controllers/adminController.ts";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.ts";

const router = Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(requireRole(["admin"]));

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/status", toggleUserStatus);
router.patch("/lawyers/:id/verification", setLawyerVerification);
router.get("/categories", getCategories);

export default router;
