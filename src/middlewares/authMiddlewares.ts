import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as {
      userId: string;
      role: string;
    };
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
