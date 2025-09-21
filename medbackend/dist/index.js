import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import {} from "express";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import webhookRoutes from "./routes/webhooks.js";
import openmicRoutes from "./routes/openmicProxy.js";
import callRoutes from "./routes/calls.js";
import patientRoutes from "./routes/patients.js";
const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: FRONTEND,
    credentials: true
}));
// Health
app.get("/", (req, res) => {
    res.json({ ok: true, message: "Welcome to med ai backend" });
});
// DB
connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/openmic", openmicRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/patients", patientRoutes);
app.listen(PORT, () => {
    console.log("--------------------------------");
    console.log(`Server is running at :${PORT}`);
});
//# sourceMappingURL=index.js.map