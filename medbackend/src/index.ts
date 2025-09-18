import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import { type Request , type Response } from 'express';


const app= express();



const PORT = process.env.PORT || 4000;
const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";
 

app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: FRONTEND,
  credentials: true
}));
 




app.get("/", (req:Request, res:Response)=>{
    res.send(" Welcome to med ai backend....")
})















app.listen(PORT, ()=>{

       console.log("Server is running at :8000");

})




























