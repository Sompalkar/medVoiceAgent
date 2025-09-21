import {} from "express";
import axios from "axios";
const OPENMIC_BASE = "https://api.openmic.ai/v1";
const API_KEY = process.env.OPENMIC_API_KEY;
const headers = {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
};
export async function listBots(req, res) {
    try {
        const resp = await axios.get(`${OPENMIC_BASE}/bots`, { headers });
        return res.status(resp.status).json(resp.data);
    }
    catch (err) {
        console.error("list bots err", err?.response?.data || err.message);
        return res.status(500).json({ error: "OpenMic list-bots error", detail: err?.response?.data || err.message });
    }
}
export async function createBot(req, res) {
    try {
        const defaultPrompt = "You are a medical intake agent. Greet the caller, confirm consent for recording, ask for their Medical ID, and when provided call the function get_patient_info with patientId. Use returned allergies/medications accurately. Be concise and empathetic; end with summary and next steps.";
        const name = req.body?.name;
        const prompt = req.body?.prompt ?? req.body?.instructions ?? defaultPrompt;
        const payload = { name, prompt };
        const resp = await axios.post(`${OPENMIC_BASE}/bots`, payload, { headers });
        return res.status(resp.status).json(resp.data);
    }
    catch (err) {
        return res.status(500).json({ error: err?.response?.data || err.message });
    }
}
export async function updateBot(req, res) {
    try {
        const { uid } = req.params;
        const incoming = req.body || {};
        const patch = { ...incoming };
        if (incoming.instructions && !incoming.prompt) {
            patch.prompt = incoming.instructions;
        }
        const resp = await axios.patch(`${OPENMIC_BASE}/bots/${uid}`, patch, { headers });
        return res.status(resp.status).json(resp.data);
    }
    catch (err) {
        return res.status(500).json({ error: err?.response?.data || err.message });
    }
}
export async function deleteBot(req, res) {
    console.log("deleteBot", req.params);
    try {
        const { uid } = req.params;
        const resp = await axios.delete(`${OPENMIC_BASE}/bots/${uid}`, { headers });
        return res.status(resp.status).json(resp.data);
    }
    catch (err) {
        return res.status(500).json({ error: err?.response?.data || err.message });
    }
}
export async function listOpenMicCalls(req, res) {
    try {
        const resp = await axios.get(`${OPENMIC_BASE}/calls`, { headers });
        return res.status(resp.status).json(resp.data);
    }
    catch (err) {
        console.error("listOpenMicCalls error", err);
        return res.status(500).json({ error: err?.response?.data || err.message });
    }
}
//# sourceMappingURL=openmicProxy.js.map