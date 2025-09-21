import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import { type Request, type Response } from "express";
import connectDB from "./config/database.ts";
import authRoutes from "./routes/auth.ts";    
import webhookRoutes from "./routes/webhooks.ts";
import openmicRoutes from "./routes/openmicProxy.ts";
import callRoutes from "./routes/calls.ts";
import patientRoutes from "./routes/patients.ts";

const app = express();

const PORT = process.env.PORT || 4000;


app.use(express.json());

app.use(cookieParser());

app.use(
  cors({

  origin:"*",
  credentials: true
})

);
 
app.get("/", (req: Request, res: Response) => {
  res.json({ ok: true, message: "Welcome to med ai backend" });
});

 
connectDB();
 


app.use("/api/auth", authRoutes);

app.use("/api/webhook", webhookRoutes);

app.use("/api/openmic", openmicRoutes);

app.use("/api/calls", callRoutes);

app.use("/api/patients", patientRoutes);








app.listen(PORT, () => { 
  console.log(`Server is running on port  :${PORT}`);



});




























