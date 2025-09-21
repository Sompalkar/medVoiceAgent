"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

type Call = {
  _id: string;
  fromNumber?: string;
  toNumber?: string;
  summary?: string;
  createdAt?: string;
};

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND}/api/calls`, { withCredentials: true });
      const data = res.data;
      setCalls(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Failed to load calls");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Call Logs</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : calls.length === 0 ? (
        <p>No calls yet</p>
      ) : (
        <ul className="space-y-4">
          {calls.map(c => (
            <li key={c._id} className="border rounded p-3">
              <div className="text-sm text-black/70 flex gap-4">
                <span><strong>From:</strong> {c.fromNumber || "—"}</span>
                <span><strong>To:</strong> {c.toNumber || "—"}</span>
                <span><strong>At:</strong> {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}</span>
              </div>
              {c.summary && <pre className="whitespace-pre-wrap mt-2 text-sm bg-black/5 p-2 rounded">{c.summary}</pre>}
              <div className="mt-2">
                <Link className="text-blue-600 hover:underline text-sm" href={`/dashboard/calls/${c._id}`}>View details</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


