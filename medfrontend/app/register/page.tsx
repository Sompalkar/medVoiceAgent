"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });
      if (!res.ok) throw new Error("Register failed");
      router.push("/login");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm border rounded-lg p-6 space-y-4">
        <h1 className="text-xl font-semibold">Register Admin</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input className="border rounded px-3 py-2 w-full bg-transparent" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="border rounded px-3 py-2 w-full bg-transparent" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2 w-full bg-transparent" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" disabled={loading} className="bg-foreground text-background rounded px-4 py-2 w-full">{loading ? "Submitting..." : "Create"}</button>
      </form>
    </div>
  );
}


