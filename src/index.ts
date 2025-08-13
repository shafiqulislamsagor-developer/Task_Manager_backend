import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { authMiddleware } from "./middlewares/authMiddlewares";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";

// config .env
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

// middlewares
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://task-manager-frontend-nu-six.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(cookieParser());
// test routes
app.get("/", (req, res) => {
  res.send("hello world");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/task", authMiddleware, taskRoutes);
app.use("/api/user", authMiddleware, userRoutes);

// mongodb connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });
