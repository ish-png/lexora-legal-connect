import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../config/jwt.ts";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access token required. Please log in to proceed.",
    });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(403).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
    return;
  }

  req.user = payload;
  next();
}

export function optionalAuthenticateToken(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}

export function requireRole(allowedRoles: ("client" | "lawyer" | "admin")[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
      });
      return;
    }

    next();
  };
}
