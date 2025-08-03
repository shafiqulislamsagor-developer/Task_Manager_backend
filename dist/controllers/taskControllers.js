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
exports.deleteTask = exports.updateTask = exports.getTasks = exports.getTaskId = exports.createTask = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, dueDate, priority, status } = req.body;
        console.log(req.body);
        const task = yield Task_1.default.create({
            title,
            description,
            dueDate,
            priority,
            status,
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        });
        res.status(201).json({ message: "Task created successfully", task });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server errors", err });
    }
});
exports.createTask = createTask;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, role } = req.user;
        const { search = "", status, priority, sort = "createdAt", page = 1, limit = 10, } = req.query;
        const query = {};
        // Regular user => only own tasks
        if (role !== "admin") {
            query.user = userId;
        }
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }
        // Filter by status/priority
        if (status)
            query.status = status;
        if (priority)
            query.priority = priority;
        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        const tasks = yield Task_1.default.find(query)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));
        const total = yield Task_1.default.countDocuments(query);
        res
            .status(200)
            .json({ total, page: Number(page), limit: Number(limit), data: tasks });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server errors", err });
    }
});
exports.getTasks = getTasks;
const getTaskId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { role, userId } = req.user;
        const task = yield Task_1.default.findById(id);
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        if (role !== "admin" && task.user.toString() !== userId) {
            return res.status(401).json({ message: "Access denied" });
        }
        res.status(200).json({ message: "Task found", data: task });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server errors", err });
    }
});
exports.getTaskId = getTaskId;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { role, userId } = req.user;
        const updates = req.body;
        const task = yield Task_1.default.findById(id);
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        if (role !== "admin" && task.user.toString() !== userId)
            return res.status(403).json({ message: "Access denied" });
        Object.assign(task, updates);
        yield task.save();
        res.status(200).json({ message: "Task updated successfully", data: task });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server errors", err });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { role, userId } = req.user;
        const task = yield Task_1.default.findById(id);
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        if (role !== "admin" && task.user.toString() !== userId)
            return res.status(403).json({ message: "Access denied" });
        yield task.deleteOne();
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server errors", err });
    }
});
exports.deleteTask = deleteTask;
