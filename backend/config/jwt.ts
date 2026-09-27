import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "legalconnect_secret_demo_jwt_key_2026";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "client" | "lawyer" | "admin";
  name: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
