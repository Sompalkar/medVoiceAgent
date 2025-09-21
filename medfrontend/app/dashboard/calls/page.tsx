"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

type Call = {
  _id: string;
  sessionId?: string;
  fromNumber?: string;
  toNumber?: string;
  summary?: string;
  transcript?: any[];
  isSuccessful?: boolean;
  toolResults?: any[];
  tags?: string[];
  followupRequired?: boolean;
  createdAt?: string;
};

export default function CallsPage() {

  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "successful" | "failed" | "followup">("all");


  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND}/api/calls`, { withCredentials: true });
      setCalls(Array.isArray(res.data) ? res.data : []);

    } catch (e: any) {

      setError(e?.response?.data?.message || e.message || "Failed to load calls");
      
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 

    load();
  
  }, []);

  const filteredCalls = calls.filter(c =>
    filter === "successful" ? c.isSuccessful :
    filter === "failed" ? c.isSuccessful === false :
    filter === "followup" ? c.followupRequired : true
  );

  const getCallStatus = (c: Call) =>
    c.followupRequired ? { text: "Follow-up Required", color: "bg-orange-100 text-orange-800" } :
    c.isSuccessful ? { text: "Successful", color: "bg-green-100 text-green-800" } :
    c.isSuccessful === false ? { text: "Failed", color: "bg-red-100 text-red-800" } :
    { text: "Completed", color: "bg-gray-100 text-gray-800" };

  const avgLength = calls.length
    ? Math.round(calls.reduce((sum, c) => sum + (c.transcript?.length || 0), 0) / calls.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Call History</h1>
          <p className="text-gray-600 mt-1">Monitor AI conversations and patient interactions</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Calls</option>
            <option value="successful">Successful</option>
            <option value="failed">Failed</option>
            <option value="followup">Need Follow-up</option>
          </select>
          <button onClick={load} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Calls", value: calls.length, color: "purple" },
          { label: "Successful", value: calls.filter(c => c.isSuccessful).length, color: "green" },
          { label: "Need Follow-up", value: calls.filter(c => c.followupRequired).length, color: "orange" },
          { label: "Avg. Length", value: avgLength, color: "blue" }
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <span className={`w-6 h-6 text-${stat.color}-600`}>●</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {loading && calls.length === 0 ? (
          <p className="text-center py-12 text-gray-600">Loading call history...</p>
        ) : filteredCalls.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No calls yet</h3>
            <p className="text-gray-600">Call logs will appear here when patients interact with your AI agents</p>
          </div>
        ) : (
          filteredCalls.map(c => {
            const status = getCallStatus(c);
            return (
              <div key={c._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{c.fromNumber || "Unknown Caller"}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>{status.text}</span>
                      {c.tags?.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">{tag}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <span>{c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}</span>
                      <span>{c.transcript?.length ? `${c.transcript.length} exchanges` : "—"}</span>
                      <span>{c.toNumber || "Medical AI"}</span>
                      {c.toolResults?.length ? <span>{c.toolResults.length} API calls</span> : null}
                    </div>
                  </div>
                  <Link href={`/dashboard/calls/${c._id}`} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">
                    View Details
                  </Link>
                </div>
                {c.summary && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Call Summary</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800">{c.summary}</div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
