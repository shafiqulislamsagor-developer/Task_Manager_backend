"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.refreshToken = exports.logout = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const createdUser = (yield User_1.default.create({ name, email, password }));
        const userId = String(createdUser._id);
        const accessToken = (0, jwt_1.generateAccessToken)(userId, createdUser.role);
        const refreshToken = (0, jwt_1.generateRefreshToken)(userId, createdUser.role);
        // Set Refresh Token as HttpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            message: "Registered successfully",
            user: {
                id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                role: createdUser.role,
            },
            accessToken,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = (yield User_1.default.findOne({ email }));
        if (!user) {
            return res.status(404).json({ message: "User email not found" });
        }
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const userId = String(user._id);
        const accessToken = (0, jwt_1.generateAccessToken)(userId, user.role);
        const refreshToken = (0, jwt_1.generateRefreshToken)(userId, user.role);
        // Set Refresh Token as HttpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
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
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
});
exports.login = login;
const refreshToken = (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not found" });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
        const newAccessToken = (0, jwt_1.generateAccessToken)(decoded.userId, decoded.role);
        res.status(200).json({
            accessToken: newAccessToken,
        });
    }
    catch (err) {
        return res
            .status(401)
            .json({ message: "Invalid or expired refresh token" });
    }
};
exports.refreshToken = refreshToken;
const logout = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
};
exports.logout = logout;
