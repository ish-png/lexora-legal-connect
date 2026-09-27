import { Router } from "express";
import { classifyIssue } from "../controllers/aiController.ts";
import { optionalAuthenticateToken } from "../middleware/authMiddleware.ts";
import { aiRateLimiter } from "../middleware/rateLimiter.ts";

const router = Router();

router.post("/classify", aiRateLimiter(40, 60000), optionalAuthenticateToken, classifyIssue);

export default router;
