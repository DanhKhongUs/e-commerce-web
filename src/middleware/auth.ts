import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

export interface AuthRequest extends Request {
  user?: { email: string; role: "user" | "admin" };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies.session_token || req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "UNAUTHORIZED" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
      role: "user" | "admin";
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "INVALID_TOKEN" });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "FORBIDDEN_ADMIN_ONLY" });
  }
  next();
};
