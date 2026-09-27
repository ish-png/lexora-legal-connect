import { Response } from "express";
import { CaseModel, LawyerProfileModel, UserModel } from "../models/store.ts";
import { AuthenticatedRequest } from "../middleware/authMiddleware.ts";
import { CaseStatus, ICaseTimelineItem, ICase } from "../models/types.ts";

export const createCase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "lawyer") {
      res.status(403).json({ success: false, message: "Only lawyers can create client case files." });
      return;
    }

    const { clientId, title, category, description, nextAction, notes } = req.body;

    if (!clientId || !title || !category || !description) {
      res.status(400).json({ success: false, message: "Client, title, category, and description are required." });
      return;
    }

    const client = await UserModel.findById(clientId);
    if (!client) {
      res.status(404).json({ success: false, message: "Client not found." });
      return;
    }

    const lawyerProf = await LawyerProfileModel.findByUserId(req.user.userId);
    if (!lawyerProf) {
      res.status(404).json({ success: false, message: "Lawyer profile not found." });
      return;
    }

    const initialTimeline: ICaseTimelineItem[] = [
      {
        id: "tl_1",
        title: "Consultation Requested",
        description: "Client submitted initial inquiry.",
        date: new Date().toISOString().split("T")[0],
        completed: true,
      },
      {
        id: "tl_2",
        title: "Lawyer Accepted",
        description: `${lawyerProf.name} accepted the consultation and opened case file.`,
        date: new Date().toISOString().split("T")[0],
        completed: true,
      },
      {
        id: "tl_3",
        title: "Documents Submitted",
        description: "Awaiting necessary legal evidence and documents.",
        date: "Pending",
        completed: false,
      },
      {
        id: "tl_4",
        title: "Consultation Completed",
        description: "Strategy and legal merits reviewed.",
        date: "Pending",
        completed: false,
      },
      {
        id: "tl_5",
        title: "Case Active",
        description: "Formal legal representation and drafting in progress.",
        date: "Pending",
        completed: false,
      },
      {
        id: "tl_6",
        title: "Case Closed",
        description: "Matter resolved or concluded.",
        date: "Pending",
        completed: false,
      },
    ];

    const newCase = await CaseModel.create({
      clientId: client._id,
      clientName: client.name,
      lawyerId: lawyerProf._id,
      lawyerName: lawyerProf.name,
      title: title.trim(),
      category,
      description: description.trim(),
      status: "New",
      nextAction: nextAction ? nextAction.trim() : "Request introductory documents from client",
      notes: notes ? notes.trim() : "",
      timeline: initialTimeline,
    });

    res.status(201).json({
      success: true,
      message: "Case file created successfully.",
      case: newCase,
    });
  } catch (error) {
    console.error("createCase error:", error);
    res.status(500).json({ success: false, message: "Failed to create case file." });
  }
};

export const getCases = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    let cases: ICase[] = [];
    if (req.user.role === "client") {
      cases = await CaseModel.find({ clientId: req.user.userId });
    } else if (req.user.role === "lawyer") {
      const lawyerProf = await LawyerProfileModel.findByUserId(req.user.userId);
      if (!lawyerProf) {
        cases = [];
      } else {
        cases = await CaseModel.find({ lawyerId: lawyerProf._id });
      }
    } else {
      // Admin
      cases = await CaseModel.find();
    }

    res.json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (error) {
    console.error("getCases error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch cases." });
  }
};

export const getCaseById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const caseItem = await CaseModel.findById(id);

    if (!caseItem) {
      res.status(404).json({ success: false, message: "Case not found." });
      return;
    }

    // Access control
    if (req.user?.role === "client" && caseItem.clientId !== req.user.userId) {
      res.status(403).json({ success: false, message: "Access denied." });
      return;
    }

    if (req.user?.role === "lawyer") {
      const lawyerProf = await LawyerProfileModel.findByUserId(req.user.userId);
      if (!lawyerProf || lawyerProf._id !== caseItem.lawyerId) {
        res.status(403).json({ success: false, message: "Access denied." });
        return;
      }
    }

    res.json({
      success: true,
      case: caseItem,
    });
  } catch (error) {
    console.error("getCaseById error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch case." });
  }
};

export const updateCase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await CaseModel.findById(id);

    if (!existing) {
      res.status(404).json({ success: false, message: "Case not found." });
      return;
    }

    if (req.user?.role === "lawyer") {
      const lawyerProf = await LawyerProfileModel.findByUserId(req.user.userId);
      if (!lawyerProf || lawyerProf._id !== existing.lawyerId) {
        res.status(403).json({ success: false, message: "Unauthorized." });
        return;
      }
    } else if (req.user?.role !== "admin") {
      res.status(403).json({ success: false, message: "Only lawyers and administrators can update case files." });
      return;
    }

    const { status, nextAction, notes, timeline } = req.body;

    // If status changed, update timeline progression
    let updatedTimeline = timeline || existing.timeline;
    if (status && status !== existing.status) {
      const today = new Date().toISOString().split("T")[0];
      if (status === "Waiting for Documents") {
        updatedTimeline = updatedTimeline.map((item: ICaseTimelineItem) =>
          item.title === "Documents Submitted" ? { ...item, completed: true, date: today } : item
        );
      } else if (status === "Consultation") {
        updatedTimeline = updatedTimeline.map((item: ICaseTimelineItem) =>
          item.title === "Consultation Completed" ? { ...item, completed: true, date: today } : item
        );
      } else if (status === "Active") {
        updatedTimeline = updatedTimeline.map((item: ICaseTimelineItem) =>
          ["Documents Submitted", "Consultation Completed", "Case Active"].includes(item.title)
            ? { ...item, completed: true, date: item.date === "Pending" ? today : item.date }
            : item
        );
      } else if (status === "Closed") {
        updatedTimeline = updatedTimeline.map((item: ICaseTimelineItem) => ({
          ...item,
          completed: true,
          date: item.date === "Pending" ? today : item.date,
        }));
      }
    }

    const updated = await CaseModel.updateById(id, {
      status: (status as CaseStatus) ?? existing.status,
      nextAction: nextAction ?? existing.nextAction,
      notes: notes ?? existing.notes,
      timeline: updatedTimeline,
    });

    res.json({
      success: true,
      message: "Case file updated successfully.",
      case: updated,
    });
  } catch (error) {
    console.error("updateCase error:", error);
    res.status(500).json({ success: false, message: "Failed to update case file." });
  }
};
