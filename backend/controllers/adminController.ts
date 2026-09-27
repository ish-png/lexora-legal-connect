import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.ts";
import { UserModel, LawyerProfileModel, ConsultationRequestModel, CaseModel } from "../models/store.ts";
import { LEGAL_CATEGORIES } from "../services/seedService.ts";

export const getAdminStats = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await UserModel.find();
    const lawyers = await LawyerProfileModel.find();
    const consultations = await ConsultationRequestModel.find();
    const cases = await CaseModel.find();

    const pendingLawyers = lawyers.filter((l) => l.verificationStatus === "pending");
    const activeCases = cases.filter((c) => c.status === "Active");

    res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalLawyers: lawyers.length,
        pendingApprovals: pendingLawyers.length,
        totalConsultations: consultations.length,
        activeCases: activeCases.length,
      },
    });
  } catch (error) {
    console.error("getAdminStats error:", error);
    res.status(500).json({ success: false, message: "Failed to calculate statistics." });
  }
};

export const getAllUsers = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await UserModel.find();
    const sanitized = users.map(({ password, ...rest }) => rest);
    res.json({
      success: true,
      users: sanitized,
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ success: false, message: "Failed to load users." });
  }
};

export const toggleUserStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "suspended", "pending"].includes(status)) {
      res.status(400).json({ success: false, message: "Invalid status value." });
      return;
    }

    const updated = await UserModel.updateById(id, { status });
    if (!updated) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    res.json({
      success: true,
      message: `User status changed to '${status}'.`,
      user: updated,
    });
  } catch (error) {
    console.error("toggleUserStatus error:", error);
    res.status(500).json({ success: false, message: "Failed to update user status." });
  }
};

export const setLawyerVerification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { verificationStatus } = req.body;

    if (!["verified", "pending", "rejected"].includes(verificationStatus)) {
      res.status(400).json({ success: false, message: "Invalid verification status." });
      return;
    }

    const updated = await LawyerProfileModel.updateById(id, { verificationStatus });
    if (!updated) {
      res.status(404).json({ success: false, message: "Lawyer not found." });
      return;
    }

    res.json({
      success: true,
      message: `Lawyer status updated to '${verificationStatus}'.`,
      lawyer: updated,
    });
  } catch (error) {
    console.error("setLawyerVerification error:", error);
    res.status(500).json({ success: false, message: "Failed to update verification status." });
  }
};

export const getCategories = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const lawyers = await LawyerProfileModel.find();

    const categoryList = LEGAL_CATEGORIES.map((cat) => {
      const count = lawyers.filter((l) =>
        l.categories.some((c) => c.toLowerCase() === cat.name.toLowerCase())
      ).length;
      return {
        ...cat,
        lawyerCount: count,
      };
    });

    res.json({
      success: true,
      categories: categoryList,
    });
  } catch (error) {
    console.error("getCategories error:", error);
    res.status(500).json({ success: false, message: "Failed to load categories." });
  }
};
