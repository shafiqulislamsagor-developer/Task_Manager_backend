import { Request, Response } from "express";
import Task from "../models/Task";

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    console.log(req.body);
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user?.userId,
    });
    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    res.status(500).json({ message: "Internal server errors", err });
  }
};

const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const {
      search = "",
      status,
      priority,
      sort = "createdAt",
      page = 1,
      limit = 10,
    } = req.query;

    const query: any = {};

    // Regular user => only own tasks
    if (role !== "admin") {
      query.user = userId;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by status/priority
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const tasks = await Task.find(query)
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments(query);

    res
      .status(200)
      .json({ total, page: Number(page), limit: Number(limit), data: tasks });
  } catch (err) {
    res.status(500).json({ message: "Internal server errors", err });
  }
};

export { createTask, getTasks };
