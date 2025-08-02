import express from "express";
import { createTask, getTasks } from "../controllers/taskControllers";

const route = express.Router();

route.post("/create-task", createTask);
route.get("/get-tasks", getTasks);

export default route;
