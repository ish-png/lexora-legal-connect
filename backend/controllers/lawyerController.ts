import { Request, Response } from "express";
import { LawyerProfileModel } from "../models/store.ts";
import { AuthenticatedRequest } from "../middleware/authMiddleware.ts";

export const getLawyers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      location,
      minExp,
      maxFee,
      language,
      mode,
      sort,
    } = req.query;

    let lawyers = await LawyerProfileModel.find({
      search: search as string,
      category: category as string,
      location: location as string,
      minExp: minExp ? Number(minExp) : undefined,
      maxFee: maxFee ? Number(maxFee) : undefined,
      language: language as string,
      mode: mode as string,
    });

    // Sorting
    if (sort === "experience_desc") {
      lawyers.sort((a, b) => b.experience - a.experience);
    } else if (sort === "fee_asc") {
      lawyers.sort((a, b) => a.consultationFee - b.consultationFee);
    } else if (sort === "fee_desc") {
      lawyers.sort((a, b) => b.consultationFee - a.consultationFee);
    } else if (sort === "name_asc") {
      lawyers.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: verified first, then experience
      lawyers.sort((a, b) => {
        if (a.verificationStatus === "verified" && b.verificationStatus !== "verified") return -1;
        if (b.verificationStatus === "verified" && a.verificationStatus !== "verified") return 1;
        return b.experience - a.experience;
      });
    }

    res.json({
      success: true,
      count: lawyers.length,
      lawyers,
    });
  } catch (error) {
    console.error("getLawyers error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve lawyers." });
  }
};

export const getLawyerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lawyer = await LawyerProfileModel.findById(id);

    if (!lawyer) {
      res.status(404).json({ success: false, message: "Lawyer profile not found." });
      return;
    }

    res.json({
      success: true,
      lawyer,
    });
  } catch (error) {
    console.error("getLawyerById error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch lawyer profile." });
  }
};

export const updateLawyerProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await LawyerProfileModel.findById(id);

    if (!existing) {
      res.status(404).json({ success: false, message: "Lawyer profile not found." });
      return;
    }

    // Check authorization: must be the lawyer themselves or admin
    if (req.user?.role !== "admin" && existing.userId !== req.user?.userId) {
      res.status(403).json({ success: false, message: "Unauthorized to update this profile." });
      return;
    }

    const {
      specialization,
      categories,
      experience,
      location,
      languages,
      education,
      bio,
      consultationFee,
      consultationModes,
      availability,
    } = req.body;

    const updated = await LawyerProfileModel.updateById(id, {
      specialization: specialization ?? existing.specialization,
      categories: categories ?? existing.categories,
      experience: experience !== undefined ? Number(experience) : existing.experience,
      location: location ?? existing.location,
      languages: languages ?? existing.languages,
      education: education ?? existing.education,
      bio: bio ?? existing.bio,
      consultationFee: consultationFee !== undefined ? Number(consultationFee) : existing.consultationFee,
      consultationModes: consultationModes ?? existing.consultationModes,
      availability: availability ?? existing.availability,
    });

    res.json({
      success: true,
      message: "Profile updated successfully.",
      lawyer: updated,
    });
  } catch (error) {
    console.error("updateLawyerProfile error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile." });
  }
};
