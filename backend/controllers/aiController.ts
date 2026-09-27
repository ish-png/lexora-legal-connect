import { Request, Response } from "express";
import { classifyLegalIssue } from "../services/geminiService.ts";
import { AIClassificationModel, LawyerProfileModel } from "../models/store.ts";
import { AuthenticatedRequest } from "../middleware/authMiddleware.ts";

export const classifyIssue = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { problemDescription } = req.body;

    if (!problemDescription || typeof problemDescription !== "string" || problemDescription.trim().length < 5) {
      res.status(400).json({
        success: false,
        message: "Please provide a description of your legal situation (at least 5 characters).",
      });
      return;
    }

    const classification = await classifyLegalIssue(problemDescription.trim());

    // Save record of classification
    await AIClassificationModel.create({
      clientId: req.user?.userId,
      problemDescription: problemDescription.trim(),
      category: classification.category,
      subCategory: classification.subCategory,
      confidence: classification.confidence,
      disclaimer: classification.disclaimer,
      summary: classification.summary,
    });

    // Find matching lawyers for this category
    const matchingLawyers = await LawyerProfileModel.find({
      category: classification.category,
      verificationStatus: "verified",
    });

    res.json({
      success: true,
      classification,
      isLowConfidence: classification.confidence < 0.6,
      matchingLawyers,
      totalMatches: matchingLawyers.length,
    });
  } catch (error) {
    console.error("AI classifyIssue error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during classification. You can browse legal categories manually.",
    });
  }
};
