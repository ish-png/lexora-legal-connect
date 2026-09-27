import { Router } from "express";
import { register, login, getMe, forgotPassword, demoLogin } from "../controllers/authController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/demo-login", demoLogin);

export default router;
