"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

type Bot = { 
  uid: string; 
  name?: string;  
  description?: string; 
  instructions?: string 

};

type BotRow = Bot & { 

  __editName?: string;
   __editPrompt?: string
  
  };

export default function BotsPage() {
  const [bots, setBots] = useState<BotRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND}/api/openmic/bots`, { withCredentials: true });
      const data = res.data;
      const rawList: any[] = (data?.bots || data?.data || data || []);
      // If list items lack instructions, fetch each bot detail to hydrate prompt/instructions
      const hydrated: BotRow[] = [];
      for (const b of rawList) {
        let instr = (b.instructions || b.prompt || "");
        if (!instr && b.uid) {
          try {
            const det = await axios.get(`${BACKEND}/api/openmic/bots/${b.uid}`, { withCredentials: true });
            instr = det.data?.instructions || det.data?.prompt || instr;
          } catch {}
        }
        hydrated.push({ ...b, instructions: instr, __editName: b.name || "", __editPrompt: instr || "" });
      }
      const list = hydrated;
      setBots(list);
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.response?.data?.error ?? e?.message;
      const msg = typeof raw === "string" ? raw : (raw?.error ? raw.error : JSON.stringify(raw || "Failed to load bots"));
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 

    // Load openmic bots  

  }, []);


  async function create() {

    if (!newName) { setError("Name is required"); return; }
    if (!newPrompt) { setError("Prompt is required"); return; }
    setLoading(true);

    try {
      await axios.post(
        `${BACKEND}/api/openmic/bots`,
        { name: newName, instructions: newPrompt, prompt: newPrompt },
        { withCredentials: true }
      );
      setNewName("");
      setNewPrompt("");
      await load();
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.response?.data?.error ?? e?.message;
      const msg = typeof raw === "string" ? raw : (raw?.error ? raw.error : JSON.stringify(raw || "Create failed"));
      setError(msg);
    } finally {
      setLoading(false);
    }

    // Create openmic bot
  }

  async function remove(uid: string) {

    setLoading(true);

    try {
      await axios.delete(`${BACKEND}/api/openmic/bots/${uid}`, { withCredentials: true });
      await load();
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.response?.data?.error ?? e?.message;
      const msg = typeof raw === "string" ? raw : (raw?.error ? raw.error : JSON.stringify(raw || "Delete failed"));
      setError(msg);
    } finally {
      setLoading(false);
    }

    // Delete openmic bot
  }

  async function rename(uid: string, name: string) {
    setLoading(true);
    try {
      await axios.patch(
        `${BACKEND}/api/openmic/bots/${uid}`,
        { name },
        { withCredentials: true }
      );
      await load();
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.response?.data?.error ?? e?.message;
      const msg = typeof raw === "string" ? raw : (raw?.error ? raw.error : JSON.stringify(raw || "Update failed"));
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function savePrompt(uid: string, prompt: string) {
    setLoading(true);
    try {
      await axios.patch(
        `${BACKEND}/api/openmic/bots/${uid}`,
        { instructions: prompt, prompt },
        { withCredentials: true }
      );
      await load();
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.response?.data?.error ?? e?.message;
      const msg = typeof raw === "string" ? raw : (raw?.error ? raw.error : JSON.stringify(raw || "Update failed"));
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="text-sm">Create Bot (name)</label>
          <input required className="w-full border rounded px-3 py-2 bg-transparent" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Medical Intake Bot" />
        </div>
        <button onClick={create} disabled={loading} className="bg-foreground text-background rounded px-4 py-2">Create</button>
      </div>

      <div>
        <label className="text-sm">Prompt (instructions)</label>
        <textarea required className="w-full border rounded p-2 bg-transparent min-h-24" placeholder="System prompt/instructions"
          value={newPrompt}
          onChange={(e)=> setNewPrompt(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/5">
            <tr>
              <th className="text-left p-2">UID</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={3}>Loading...</td></tr>
            ) : bots.length === 0 ? (
              <tr><td className="p-3" colSpan={3}>No bots</td></tr>
            ) : bots.map(b => (
              <tr key={b.uid} className="border-t">
                <td className="p-2 font-mono">{b.uid}</td>
                <td className="p-2">
                  <div className="flex gap-2 items-center">
                    <input className="border rounded px-2 py-1 bg-transparent"
                      value={b.__editName}
                      onChange={(e)=> setBots(prev => prev.map(x => x.uid===b.uid ? { ...x, __editName: e.target.value } : x))}
                    />
                    <button onClick={() => rename(b.uid, b.__editName || "")} className="text-blue-600 hover:underline">Save</button>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex flex-col gap-1">
                    <textarea className="border rounded p-2 bg-transparent min-h-24" placeholder="System prompt/instructions"
                      value={b.__editPrompt}
                      onChange={(e)=> setBots(prev => prev.map(x => x.uid===b.uid ? { ...x, __editPrompt: e.target.value } : x))}
                    />
                    <div className="flex gap-3">
                      <button onClick={() => savePrompt(b.uid, b.__editPrompt || "")} className="text-blue-600 hover:underline">Save Prompt</button>
                      <button onClick={() => remove(b.uid)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


