import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// config .env
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// test routes
app.get("/", (req, res) => {
  res.send("hello world");
});

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
