import mongoose from "mongoose";

export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface ITask extends mongoose.Document {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: TaskPriority;
  status: TaskStatus;
  user: mongoose.Types.ObjectId;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: String,
    dueDate: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
