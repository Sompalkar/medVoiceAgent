import { type Request, type Response } from "express";
import Patient from "../models/Patient.js";

export async function listPatients(req: Request, res: Response) {

  try {

    const rows = await Patient.find({}).sort({ createdAt: -1 }).limit(200);

        return res.json(rows);

  } catch (err) {

    console.error("listPatients error", err);

    return res.status(500).json({ message: "Failed to load patients" });

  }
}

export async function createPatient(req: Request, res: Response) {
  
  
     try {

    const { medicalId, name, phone, dob, allergies, medications, notes, lastVisit } = req.body;


    if (!medicalId || !name || !phone) 
      
      return res.status(400).json({ message: "medicalId, name, phone required" });


    const p = new Patient({ medicalId, name, phone, dob, allergies, medications, notes, lastVisit });


    await p.save();

    return res.status(201).json(p);

  } catch (err: any) {

    console.error("createPatient error", err?.message);

    return res.status(500).json({ message: "Failed to create patient" });


  }
}

export async function deletePatient(req: Request, res: Response) {
  try {

    const { id } = req.params;


    await Patient.findByIdAndDelete(id);


    return res.json({ ok: true });


  } catch (err) {


    console.error("deletePatient error", err);

    return res.status(500).json({ message: "Failed to delete patient" });


  }
}

export async function updatePatient(req: Request, res: Response) {

  try {

    const { id } = req.params;
    const update = req.body;


    const row = await Patient.findByIdAndUpdate(id, update, { new: true });

    if (!row){
      return res.status(404).json({ message: "Not found" });
    }

    return res.json(row);

  } catch (err) {
      
    console.error("updatePatient error", err);  

    return res.status(500).json({ message: "Failed to update patient" });
    
  }
}


