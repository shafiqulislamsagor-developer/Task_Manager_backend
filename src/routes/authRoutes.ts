import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/authControllers";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
