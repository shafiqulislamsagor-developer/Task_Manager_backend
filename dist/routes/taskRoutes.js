"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskControllers_1 = require("../controllers/taskControllers");
const route = express_1.default.Router();
route.post("/create-task", taskControllers_1.createTask);
route.get("/get-tasks", taskControllers_1.getTasks);
route.get("/get-task/:id", taskControllers_1.getTaskId);
route.put("/update-task/:id", taskControllers_1.updateTask);
route.delete("/delete-task/:id", taskControllers_1.deleteTask);
exports.default = route;
