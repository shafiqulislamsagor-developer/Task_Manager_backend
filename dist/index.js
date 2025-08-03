"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const authMiddlewares_1 = require("./middlewares/authMiddlewares");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
// config .env
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// test routes
app.get("/", (req, res) => {
    res.send("hello world");
});
// routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/task", authMiddlewares_1.authMiddleware, taskRoutes_1.default);
// mongodb connection
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
        console.log("Server is running on port", port);
    });
})
    .catch((err) => {
    console.error("❌ DB connection failed:", err);
});
