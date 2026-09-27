import { Response } from "express";
import { ConsultationRequestModel, LawyerProfileModel, UserModel } from "../models/store.ts";
import { AuthenticatedRequest } from "../middleware/authMiddleware.ts";
import { ConsultationStatus, IConsultationRequest } from "../models/types.ts";

export const createConsultation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Please log in to submit a consultation request." });
      return;
    }

    const {
      lawyerId,
      category,
      problemDescription,
      preferredDate,
      preferredTime,
      mode,
      notes,
    } = req.body;

    if (!lawyerId || !category || !problemDescription || !preferredDate || !preferredTime || !mode) {
      res.status(400).json({
        success: false,
        message: "Please complete all required fields (lawyer, category, problem description, date, time, mode).",
      });
      return;
    }

    const lawyer = await LawyerProfileModel.findById(lawyerId);
    if (!lawyer) {
      res.status(404).json({ success: false, message: "Selected lawyer was not found." });
      return;
    }

    const client = await UserModel.findById(req.user.userId);
    if (!client) {
      res.status(404).json({ success: false, message: "Client user account not found." });
      return;
    }

    const newRequest = await ConsultationRequestModel.create({
      clientId: client._id,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone || "",
      lawyerId: lawyer._id,
      lawyerName: lawyer.name,
      category,
      problemDescription: problemDescription.trim(),
      preferredDate,
      preferredTime,
      mode,
      status: "Pending",
      notes: notes ? notes.trim() : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Consultation request submitted successfully. The lawyer will review your request.",
      consultation: newRequest,
    });
  } catch (error) {
    console.error("createConsultation error:", error);
    res.status(500).json({ success: false, message: "Failed to submit consultation request." });
  }
};

export const getMyConsultations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    let list: IConsultationRequest[] = [];
    if (req.user.role === "client") {
      list = await ConsultationRequestModel.find({ clientId: req.user.userId });
    } else if (req.user.role === "lawyer") {
      const lawyerProf = await LawyerProfileModel.findByUserId(req.user.userId);
      if (!lawyerProf) {
        list = [];
      } else {
        list = await ConsultationRequestModel.find({ lawyerId: lawyerProf._id });
      }
    } else {
      // Admin sees all
      list = await ConsultationRequestModel.find();
    }

    res.json({
      success: true,
      count: list.length,
      consultations: list,
    });
  } catch (error) {
    console.error("getMyConsultations error:", error);
    res.status(500).json({ success: false, message: "Failed to load consultations." });
  }
};

export const getConsultationById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const request = await ConsultationRequestModel.findById(id);

    if (!request) {
      res.status(404).json({ success: false, message: "Consultation request not found." });
      return;
    }

    // Access check
    if (req.user?.role === "client" && request.clientId !== req.user.userId) {
      res.status(403).json({ success: false, message: "Access denied." });
      return;
    }

    if (req.user?.role === "lawyer") {
      const lawyerProf = await LawyerProfileModel.findByUserId(req.user.userId);
      if (!lawyerProf || lawyerProf._id !== request.lawyerId) {
        res.status(403).json({ success: false, message: "Access denied." });
        return;
      }
    }

    res.json({
      success: true,
      consultation: request,
    });
  } catch (error) {
    console.error("getConsultationById error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch consultation details." });
  }
};

export const updateConsultationStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes, meetingLink } = req.body;

    const existing = await ConsultationRequestModel.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: "Consultation request not found." });
      return;
    }

    // Authorization
    if (req.user?.role === "lawyer") {
      const lawyerProf = await LawyerProfileModel.findByUserId(req.user.userId);
      if (!lawyerProf || lawyerProf._id !== existing.lawyerId) {
        res.status(403).json({ success: false, message: "Unauthorized to update this request." });
        return;
      }
    } else if (req.user?.role === "client") {
      if (existing.clientId !== req.user.userId) {
        res.status(403).json({ success: false, message: "Unauthorized to update this request." });
        return;
      }
      // Clients can only Cancel their own pending requests
      if (status !== "Cancelled") {
        res.status(403).json({ success: false, message: "Clients can only cancel their requests." });
        return;
      }
    } else if (req.user?.role !== "admin") {
      res.status(403).json({ success: false, message: "Forbidden" });
      return;
    }

    const updated = await ConsultationRequestModel.updateById(id, {
      status: status as ConsultationStatus,
      notes: notes ?? existing.notes,
      meetingLink: meetingLink ?? (status === "Accepted" ? `https://meet.legalconnect.demo/${existing._id.substring(0, 8)}` : existing.meetingLink),
    });

    res.json({
      success: true,
      message: `Consultation status updated to '${status}'.`,
      consultation: updated,
    });
  } catch (error) {
    console.error("updateConsultationStatus error:", error);
    res.status(500).json({ success: false, message: "Failed to update consultation status." });
  }
};
