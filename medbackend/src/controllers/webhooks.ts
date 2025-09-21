import { type  Request, type  Response } from "express";
import Patient from "../models/Patient.js";
import CallLog from "../models/CallLog.js";


export async function handlePreCall(req: Request, res: Response) {
  try {
    const body = req.body;
    const from = body?.call?.from_number || body?.fromPhoneNumber || body?.from_number;

    if (!from) {
      return res.json({ call: { dynamic_variables: {} } });
    }

    
    const patient = await Patient.findOne({ phone: from });

    if (!patient) return res.json({ call: { dynamic_variables: {} } });

    const dyn = {

      patient_name: patient.name,
      medical_id: patient.medicalId,
      allergies: patient.allergies || "",
      last_visit: patient.lastVisit ? patient.lastVisit.toISOString().split("T")[0] : "",

      primary_physician: (patient as any).primaryPhysician || "",
      insurance_provider: (patient as any).insuranceProvider || "",
      conditions: (patient as any).conditions?.join(", ") || "",
      emergency_contact: (patient as any).emergencyContactName || ""
    };


    return res.json({ call: { dynamic_variables: dyn } });

  } catch (err) {
    console.error("pre-call error", err);
    return res.status(500).json({ call: { dynamic_variables: {} } });
  }
}

 
export async function handleGetPatient(req: Request, res: Response) {

  try {
    const body = req.body;
    const patientId = body?.tool?.patient_id || body?.patientId || body?.query || body?.medicalId;
    
    if (!patientId) {
      return res.json({ tool: { dynamic_variables: {} } });
    }

    const patient = await Patient.findOne({ medicalId: patientId });


    if (!patient) {
      return res.json({ tool: { dynamic_variables: {} } });
    }

    const dyn = {
      patient_name: patient.name,
      medical_id: patient.medicalId,
      allergies: patient.allergies || "",
      medications: patient.medications || "",
      last_visit: patient.lastVisit ? patient.lastVisit.toISOString().split("T")[0] : "",
      primary_physician: (patient as any).primaryPhysician || "",
      insurance_provider: (patient as any).insuranceProvider || "",
      conditions: (patient as any).conditions?.join(", ") || "",
      emergency_contact: (patient as any).emergencyContactName || ""
    };

     
    const sessionId = body?.sessionId || body?.session_id || body?.call_id || body?.call?.id;

    if (sessionId) {

      try {
        await CallLog.findOneAndUpdate(
          { sessionId },
          { $push: { toolResults: { tool: "get-patient", args: { patientId }, dynamicVariables: dyn } } },
          { upsert: true }
        );

      } catch (e) {

        console.error("tool result log error", e);


      }
    }


    return res.json({ tool: { dynamic_variables: dyn } });

  } catch (err) {
    console.error("get-patient error", err);
    return res.status(500).json({ tool: { dynamic_variables: {} } });
  }
}

 
export async function handlePostCall(req: Request, res: Response) {

  try {

    const body = req.body; 
    const report = body;
    const sessionId = report?.sessionId || report?.call_id || report?.session_id || null;
    const transcript = report?.transcript || report?.transcripts || [];
    const summary = report?.summary || report?.call_summary || "";
    const from = report?.fromPhoneNumber || report?.from_number || (report?.call?.from_number);
    const to = report?.toPhoneNumber || report?.to_number || (report?.call?.to_number);

    const base = {
      sessionId,
      fromNumber: from,
      toNumber: to,
      transcript,
      summary,
      isSuccessful: !!report?.isSuccessful,
      dynamicVariables: report?.dynamicVariables || report?.call?.dynamic_variables || {}
    } as any;

    
    const tags: string[] = [];
    const lowerSummary = (summary || "").toLowerCase();

    if (lowerSummary.includes("follow-up") || lowerSummary.includes("follow up")) tags.push("followup");
    if (lowerSummary.includes("urgent")) tags.push("urgent");

    const followupRequired = tags.includes("followup");

    const log = new CallLog({ ...base, tags, followupRequired });
    await log.save();


    console.log("Saved post-call report", sessionId);

    return res.status(200).json({ ok: true });


  } catch (err) {

    console.error("post-call error:", err);

    return res.status(500).json({ ok: false, error: err });


  }
}
