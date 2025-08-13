import { Request, Response } from "express";
import User from "../models/User";
interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user!;
    const user = await User.findById(id).select({
      password: 0,
      __v: 0,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (id !== userId && role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    return res.status(200).json({ message: "User found", data: user });
  } catch (err) {
    res.status(500).json({ message: "Internal server errors", err });
  }
};

export { getUser };
