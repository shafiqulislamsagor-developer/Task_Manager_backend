import express from "express";
import {
  createTask,
  deleteTask,
  getTaskId,
  getTasks,
  updateTask,
} from "../controllers/taskControllers";

const route = express.Router();

route.post("/create-task", createTask);
route.get("/get-tasks", getTasks);
route.get("/get-task/:id", getTaskId);
route.put("/update-task/:id", updateTask);
route.delete("/delete-task/:id", deleteTask);

export default route;
