import { type Request, type Response } from "express";
import CallLog from "../models/CallLog.ts";

export async function listSavedCalls(req: Request, res: Response) {
  try {
    const rows = await CallLog.find({}).sort({ createdAt: -1 }).limit(200);


    return res.json(rows);

  } catch (err) {
    console.error("listSavedCalls error", err);

    return res.status(500).json({ message: "Failed to load calls" });
  }
}



export async function getCallById(req: Request, res: Response) {
  try {

    const { id } = req.params;

    const row = await CallLog.findById(id);

    if (!row) return res.status(404).json({ message: "Not found" });

    return res.json(row);
  } catch (err) {

    console.error("getCallById error", err);

    return res.status(500).json({ message: "Failed to load call" });
    
  }
}


