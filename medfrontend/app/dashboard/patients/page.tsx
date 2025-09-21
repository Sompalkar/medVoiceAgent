"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

type Patient = {
  _id?: string;
  medicalId: string;
  name: string;
  phone: string;
  allergies?: string;
  medications?: string;
  primaryPhysician?: string;
  insuranceProvider?: string;
  conditions?: string;
};

export default function PatientsPage() {
  const [rows, setRows] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Patient>({ medicalId: "", name: "", phone: "" });

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND}/api/patients`, { withCredentials: true });
      const data = res.data;
      setRows(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function create() {
    setLoading(true);
    try {
      await axios.post(
        `${BACKEND}/api/patients`,
        form,
        { withCredentials: true }
      );
      setForm({ medicalId: "", name: "", phone: "" });
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    setLoading(true);
    try {
      await axios.delete(`${BACKEND}/api/patients/${id}`, { withCredentials: true });
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  async function save(p: Patient) {
    if (!p._id) return;
    setLoading(true);
    try {
      await axios.patch(
        `${BACKEND}/api/patients/${p._id}`,
        { name: p.name, phone: p.phone },
        { withCredentials: true }
      );
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Patients</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded p-4 space-y-2">
          <h2 className="font-medium">Create</h2>
          <input className="border rounded px-3 py-2 w-full bg-transparent" placeholder="Medical ID" value={form.medicalId} onChange={e=>setForm(prev=>({...prev, medicalId:e.target.value}))} />
          <input className="border rounded px-3 py-2 w-full bg-transparent" placeholder="Name" value={form.name} onChange={e=>setForm(prev=>({...prev, name:e.target.value}))} />
          <input className="border rounded px-3 py-2 w-full bg-transparent" placeholder="Phone e.g., +15551234567" value={form.phone} onChange={e=>setForm(prev=>({...prev, phone:e.target.value}))} />
          <input className="border rounded px-3 py-2 w-full bg-transparent" placeholder="Allergies" value={form.allergies || ""} onChange={e=>setForm(prev=>({...prev, allergies:e.target.value}))} />
          <input className="border rounded px-3 py-2 w-full bg-transparent" placeholder="Medications" value={form.medications || ""} onChange={e=>setForm(prev=>({...prev, medications:e.target.value}))} />
          <input className="border rounded px-3 py-2 w-full bg-transparent" placeholder="Primary Physician" value={form.primaryPhysician || ""} onChange={e=>setForm(prev=>({...prev, primaryPhysician:e.target.value}))} />
          <input className="border rounded px-3 py-2 w-full bg-transparent" placeholder="Insurance Provider" value={form.insuranceProvider || ""} onChange={e=>setForm(prev=>({...prev, insuranceProvider:e.target.value}))} />
          <input className="border rounded px-3 py-2 w-full bg-transparent" placeholder="Conditions (comma-separated)" value={form.conditions || ""} onChange={e=>setForm(prev=>({...prev, conditions:e.target.value}))} />
          <button onClick={create} disabled={loading} className="bg-foreground text-background rounded px-4 py-2">Save</button>
        </div>
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/5">
              <tr>
                <th className="text-left p-2">Medical ID</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Phone</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-3" colSpan={4}>Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td className="p-3" colSpan={4}>No patients</td></tr>
              ) : rows.map(p => (
                <tr key={p._id} className="border-t">
                  <td className="p-2 font-mono">{p.medicalId}</td>
                  <td className="p-2">
                    <input className="border rounded px-2 py-1 bg-transparent" value={p.name}
                      onChange={(e)=> setRows(prev => prev.map(x => x._id===p._id ? { ...x, name: e.target.value } : x))} />
                  </td>
                  <td className="p-2">
                    <input className="border rounded px-2 py-1 bg-transparent" value={p.phone}
                      onChange={(e)=> setRows(prev => prev.map(x => x._id===p._id ? { ...x, phone: e.target.value } : x))} />
                  </td>
                  <td className="p-2 flex gap-3">
                    <button onClick={()=> save(p)} className="text-blue-600 hover:underline">Save</button>
                    <button onClick={()=> remove(p._id!)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


