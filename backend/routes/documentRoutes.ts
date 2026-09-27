import { Router } from "express";
import { uploadDocument, getDocuments, deleteDocument } from "../controllers/documentController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";

const router = Router();

router.post("/", authenticateToken, uploadDocument);
router.get("/", authenticateToken, getDocuments);
router.delete("/:id", authenticateToken, deleteDocument);

export default router;
