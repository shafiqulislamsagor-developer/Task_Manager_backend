import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User exists" });

    const user = (await User.create({ name, email, password })) as IUser;
    const userId = String(user._id);

    const accessToken = generateAccessToken(userId, user.role);
    const refreshToken = generateRefreshToken(userId, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = (await User.findOne({ email })) as IUser;
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const userId = String(user._id);
    const accessToken = generateAccessToken(userId, user.role);
    const refreshToken = generateRefreshToken(userId, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(401).json({ message: "Authentication required" });

    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as {
      userId: string;
      role: string;
    };

    const newAccessToken = generateAccessToken(decoded.userId, decoded.role);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
