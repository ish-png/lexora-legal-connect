import { Response } from "express";
import { DocumentModel, CaseModel, LawyerProfileModel } from "../models/store.ts";
import { AuthenticatedRequest } from "../middleware/authMiddleware.ts";
import { IDocument } from "../models/types.ts";

export const uploadDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { caseId, consultationId, fileName, fileType, fileSize, fileUrl } = req.body;

    if (!fileName || !fileType) {
      res.status(400).json({ success: false, message: "File name and document type are required." });
      return;
    }

    let assignedLawyerId: string | undefined;

    if (caseId) {
      const caseItem = await CaseModel.findById(caseId);
      if (!caseItem) {
        res.status(404).json({ success: false, message: "Associated case not found." });
        return;
      }

      // Check access permission
      if (req.user.role === "client" && caseItem.clientId !== req.user.userId) {
        res.status(403).json({ success: false, message: "Cannot upload documents to another user's case." });
        return;
      }
      if (req.user.role === "lawyer") {
        const lawyerProf = await LawyerProfileModel.findByUserId(req.user.userId);
        if (!lawyerProf || lawyerProf._id !== caseItem.lawyerId) {
          res.status(403).json({ success: false, message: "Cannot upload documents to an unassigned case." });
          return;
        }
        assignedLawyerId = lawyerProf._id;
      } else {
        assignedLawyerId = caseItem.lawyerId;
      }
    }

    const newDoc = await DocumentModel.create({
      caseId: caseId || undefined,
      consultationId: consultationId || undefined,
      clientId: req.user.role === "client" ? req.user.userId : (req.body.clientId || req.user.userId),
      clientName: req.user.name,
      lawyerId: assignedLawyerId,
      fileName: fileName.trim(),
      fileType: fileType.trim(),
      fileSize: fileSize || "1.2 MB",
      fileUrl: fileUrl || `data:application/pdf;base64,demo_legal_doc_${Date.now()}`,
      uploadedBy: req.user.role === "lawyer" ? "lawyer" : "client",
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      document: newDoc,
    });
  } catch (error) {
    console.error("uploadDocument error:", error);
    res.status(500).json({ success: false, message: "Failed to upload document." });
  }
};

export const getDocuments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { caseId } = req.query;

    let documents: IDocument[] = [];

    if (caseId) {
      // Validate access to specific case
      const caseItem = await CaseModel.findById(caseId as string);
      if (!caseItem) {
        res.status(404).json({ success: false, message: "Case not found." });
        return;
      }

      if (req.user.role === "client" && caseItem.clientId !== req.user.userId) {
        res.status(403).json({ success: false, message: "Access denied to these documents." });
        return;
      }

      if (req.user.role === "lawyer") {
        const lawyerProf = await LawyerProfileModel.findByUserId(req.user.userId);
        if (!lawyerProf || lawyerProf._id !== caseItem.lawyerId) {
          res.status(403).json({ success: false, message: "Access denied to these documents." });
          return;
        }
      }

      documents = await DocumentModel.find({ caseId: caseId as string });
    } else {
      // General list for current user
      if (req.user.role === "client") {
        documents = await DocumentModel.find({ clientId: req.user.userId });
      } else if (req.user.role === "lawyer") {
        const lawyerProf = await LawyerProfileModel.findByUserId(req.user.userId);
        if (!lawyerProf) {
          documents = [];
        } else {
          documents = await DocumentModel.find({ lawyerId: lawyerProf._id });
        }
      } else {
        // Admin
        documents = await DocumentModel.find();
      }
    }

    res.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("getDocuments error:", error);
    res.status(500).json({ success: false, message: "Failed to load documents." });
  }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doc = await DocumentModel.findById(id);

    if (!doc) {
      res.status(404).json({ success: false, message: "Document not found." });
      return;
    }

    // Access check: only creator, assigned lawyer, or admin
    if (req.user?.role === "client" && doc.clientId !== req.user.userId) {
      res.status(403).json({ success: false, message: "Unauthorized to delete this document." });
      return;
    }

    if (req.user?.role === "lawyer") {
      const lawyerProf = await LawyerProfileModel.findByUserId(req.user.userId);
      if (!lawyerProf || lawyerProf._id !== doc.lawyerId) {
        res.status(403).json({ success: false, message: "Unauthorized to delete this document." });
        return;
      }
    }

    await DocumentModel.deleteById(id);

    res.json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    console.error("deleteDocument error:", error);
    res.status(500).json({ success: false, message: "Failed to delete document." });
  }
};
