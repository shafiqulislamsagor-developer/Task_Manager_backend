import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/authControllers";
const route = express.Router();

route.post("/register", register);
route.post("/login", login);
route.post("/refresh-token", refreshToken);
route.post("/logout", logout);

export default route;
