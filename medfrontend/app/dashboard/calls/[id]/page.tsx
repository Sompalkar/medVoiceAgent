"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

export default function CallDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [call, setCall] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BACKEND}/api/calls/${id}`, { withCredentials: true });
        setCall(res.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || e.message || "Failed to load call");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (!id) return <div className="p-6">Invalid call id</div>;
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!call) return <div className="p-6">No data</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Call {call._id}</h1>
      <div className="text-sm text-black/70 flex gap-4">
        <span><strong>From:</strong> {call.fromNumber || "—"}</span>
        <span><strong>To:</strong> {call.toNumber || "—"}</span>
        <span><strong>At:</strong> {call.createdAt ? new Date(call.createdAt).toLocaleString() : "—"}</span>
      </div>
      {call.summary && (
        <div>
          <h2 className="font-medium">Summary</h2>
          <pre className="whitespace-pre-wrap bg-black/5 p-3 rounded text-sm">{call.summary}</pre>
        </div>
      )}
      {call.dynamicVariables && Object.keys(call.dynamicVariables).length > 0 && (
        <div>
          <h2 className="font-medium">Dynamic Variables</h2>
          <pre className="bg-black/5 p-3 rounded text-sm">{JSON.stringify(call.dynamicVariables, null, 2)}</pre>
        </div>
      )}
      {Array.isArray(call.toolResults) && call.toolResults.length > 0 && (
        <div>
          <h2 className="font-medium">Tool Results</h2>
          <ul className="space-y-2">
            {call.toolResults.map((t: any, i: number) => (
              <li key={i} className="border rounded p-2 text-sm">
                <div className="text-black/70">{t.tool} @ {t.at ? new Date(t.at).toLocaleString() : "—"}</div>
                <pre className="bg-black/5 p-2 rounded mt-1">{JSON.stringify({ args: t.args, dynamicVariables: t.dynamicVariables }, null, 2)}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}
      {(Array.isArray(call.tags) && call.tags.length > 0) && (
        <div>
          <h2 className="font-medium">Tags</h2>
          <div className="flex gap-2 flex-wrap">
            {call.tags.map((tag: string, i: number) => (
              <span key={i} className="px-2 py-1 text-xs border rounded">{tag}</span>
            ))}
          </div>
        </div>
      )}
      <div>
        <h2 className="font-medium">Export</h2>
        <button
          className="text-blue-600 hover:underline text-sm"
          onClick={() => {
            const text = `Summary\n${call.summary || ""}\n\nTranscript\n${(call.transcript || []).map((l: any) => typeof l === "string" ? l : JSON.stringify(l)).join("\n")}`;
            const blob = new Blob([text], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `call-${call._id}.txt`; a.click();
            URL.revokeObjectURL(url);
          }}
        >Download transcript (.txt)</button>
      </div>
      {Array.isArray(call.transcript) && call.transcript.length > 0 && (
        <div>
          <h2 className="font-medium">Transcript</h2>
          <div className="space-y-1 text-sm">
            {call.transcript.map((line: any, i: number) => (
              <div key={i} className="bg-black/5 rounded p-2">
                {typeof line === "string" ? line : JSON.stringify(line)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


