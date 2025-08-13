import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const createdUser = (await User.create({ name, email, password })) as IUser;

    const userId = String(createdUser._id);
    const accessToken = generateAccessToken(userId, createdUser.role);
    const refreshToken = generateRefreshToken(userId, createdUser.role);

    // Set Refresh Token as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = (await User.findOne({ email })) as IUser;
    if (!user) {
      return res.status(404).json({ message: "User email not found" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const userId = String(user._id);
    const accessToken = generateAccessToken(userId, user.role);
    const refreshToken = generateRefreshToken(userId, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
};

const refreshToken = (req: Request, res: Response) => {
  try {
    // 1. Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

    if (!refreshToken) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // 2. Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as {
      userId: string;
      role: string;
    };
    console.log(decoded);
    // 3. Generate new access token
    const newAccessToken = generateAccessToken(decoded.userId, decoded.role);

    // 4. Send the new access token
    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export { login, logout, refreshToken, register };
