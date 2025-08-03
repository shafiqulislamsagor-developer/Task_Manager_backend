"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const route = express_1.default.Router();
route.post("/register", authControllers_1.register);
route.post("/login", authControllers_1.login);
route.post("/refresh-token", authControllers_1.refreshToken);
route.post("/logout", authControllers_1.logout);
exports.default = route;
