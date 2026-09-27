import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel, LawyerProfileModel } from "../models/store.ts";
import { generateToken } from "../config/jwt.ts";
import { AuthenticatedRequest } from "../middleware/authMiddleware.ts";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role, specialization, categories, experience, location, consultationFee } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ success: false, message: "Please fill in all required fields." });
      return;
    }

    if (!["client", "lawyer"].includes(role)) {
      res.status(400).json({ success: false, message: "Invalid role specified." });
      return;
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(400).json({ success: false, message: "An account with this email already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userStatus = role === "lawyer" ? "active" : "active";

    const newUser = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || "",
      password: hashedPassword,
      role,
      status: userStatus,
    });

    // If lawyer, create lawyer profile
    if (role === "lawyer") {
      await LawyerProfileModel.create({
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        specialization: specialization || "General Practice",
        categories: categories && categories.length ? categories : ["Civil Law"],
        experience: Number(experience) || 1,
        location: location || "New York, NY",
        languages: ["English"],
        education: "Law Degree / LL.B / J.D.",
        bio: `Adv. ${newUser.name} provides professional legal consultations specializing in ${specialization || "Civil and Commercial Law"}.`,
        consultationFee: Number(consultationFee) || 150,
        consultationModes: ["Video Call", "Phone Call"],
        availability: ["Mon-Fri 09:00 - 17:00"],
        verificationStatus: "verified", // Demo friendly
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newUser.name)}`,
        isDemo: false,
      });
    }

    const token = generateToken({
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Failed to register account." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required." });
      return;
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.password) {
      res.status(401).json({ success: false, message: "Invalid email or password." });
      return;
    }

    if (user.status === "suspended") {
      res.status(403).json({ success: false, message: "This account has been suspended. Please contact administrator." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid email or password." });
      return;
    }

    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    let lawyerProfileId: string | undefined;
    if (user.role === "lawyer") {
      const prof = await LawyerProfileModel.findByUserId(user._id);
      lawyerProfileId = prof?._id;
    }

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        lawyerProfileId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "An error occurred while logging in." });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    const user = await UserModel.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    let lawyerProfile: any = null;
    if (user.role === "lawyer") {
      lawyerProfile = await LawyerProfileModel.findByUserId(user._id);
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        createdAt: user.createdAt,
        lawyerProfile,
      },
    });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user profile." });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  // Demo password reset acknowledgement
  res.json({
    success: true,
    message: `If an account exists for ${email}, demo instructions have been generated. You may log in using password 'password123' or 'lawyer123'.`,
  });
};

export const demoLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    let targetEmail = "sarah@demo.legalconnect.com";
    if (role === "lawyer") targetEmail = "marcus.vance@demo.legalconnect.com";
    if (role === "admin") targetEmail = "admin@legalconnect.com";

    const user = await UserModel.findOne({ email: targetEmail });
    if (!user) {
      res.status(404).json({ success: false, message: `Demo user for role '${role}' not found.` });
      return;
    }

    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    let lawyerProfileId: string | undefined;
    if (user.role === "lawyer") {
      const prof = await LawyerProfileModel.findByUserId(user._id);
      lawyerProfileId = prof?._id;
    }

    res.json({
      success: true,
      message: `Logged in as Demo ${user.role.toUpperCase()}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        lawyerProfileId,
      },
    });
  } catch (error) {
    console.error("demoLogin error:", error);
    res.status(500).json({ success: false, message: "Demo login failed." });
  }
};

