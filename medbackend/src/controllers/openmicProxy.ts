import { type Request, type Response } from "express";
import axios from "axios";

const OPENMIC_BASE = "https://api.openmic.ai/v1";  
const API_KEY = process.env.OPENMIC_API_KEY;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "x-api-key": API_KEY,
  "Content-Type": "application/json",
} as const;



export async function listBots(req: Request, res: Response) {
  try {
    const resp = await axios.get(`${OPENMIC_BASE}/bots`, { headers });

    return res.status(resp.status).json(resp.data);
  } catch (err: any) {
    console.error("list bots err", err?.response?.data || err.message);

    return res.status(500).json({
      error: "OpenMic list-bots error",
      detail: err?.response?.data || err.message,
    });
  }
}



export async function getBot(req: Request, res: Response) {
  try {
    const { uid } = req.params;

    const resp = await axios.get(`${OPENMIC_BASE}/bots/${uid}`, { headers });

    return res.status(resp.status).json(resp.data);
  } catch (err: any) {
    const status = err?.response?.status || 500;
    const detail = err?.response?.data || err.message;

    return res.status(status).json({
      error: detail,
      message: typeof detail === "string"
        ? detail
        : detail?.error || "OpenMic error",
    });
  }
}



export async function createBot(req: Request, res: Response) {
  try {
     
    const name = req.body?.name;
    const prompt = req.body?.prompt ?? req.body?.instructions ;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    if (!prompt) {
      return res.status(400).json({ message: "prompt is required" });
    }

    const payload = { name, prompt, instructions: prompt };

    console.log("[openmic] createBot payload:", payload);

    const resp = await axios.post(`${OPENMIC_BASE}/bots`, payload, { headers });

    return res.status(resp.status).json(resp.data);
    
  } catch (err: any) {
    const status = err?.response?.status || 500;
    const detail = err?.response?.data || err.message;

    console.error("[openmic] createBot error", status, detail);

    return res.status(status).json({
      error: detail,
      message: typeof detail === "string"
        ? detail
        : detail?.error || "OpenMic error",
    });
  }
}



export async function updateBot(req: Request, res: Response) {
  try {
    const { uid } = req.params;

    const incoming = req.body || {};
    const patch: any = { ...incoming };

    if (incoming.instructions && !incoming.prompt) {
      patch.prompt = incoming.instructions;
    }

    if (incoming.prompt && !incoming.instructions) {
      patch.instructions = incoming.prompt;
    }

    const resp = await axios.patch(`${OPENMIC_BASE}/bots/${uid}`, patch, { headers });

    return res.status(resp.status).json(resp.data);
  } catch (err: any) {
    return res.status(500).json({
      error: err?.response?.data || err.message,
    });
  }
}



export async function deleteBot(req: Request, res: Response) {
  console.log("deleteBot", req.params);

  try {
    const { uid } = req.params;

    const resp = await axios.delete(`${OPENMIC_BASE}/bots/${uid}`, { headers });

    return res.status(resp.status).json(resp.data);
  } catch (err: any) {
    return res.status(500).json({
      error: err?.response?.data || err.message,
    });
  }
}



export async function listOpenMicCalls(req: Request, res: Response) {
  try {
    const resp = await axios.get(`${OPENMIC_BASE}/calls`, { headers });

    return res.status(resp.status).json(resp.data);
  } catch (err: any) {
    console.error("listOpenMicCalls error", err);

    return res.status(500).json({
      error: err?.response?.data || err.message,
    });
  }
}
