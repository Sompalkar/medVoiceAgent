"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "/api";

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <form onSubmit={onSubmit} className="border border-gray-200 rounded-xl p-8 bg-white shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create Account</h1>
          <p className="text-sm text-gray-600 mb-6">Set up your admin account</p>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <div className="mb-5">
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="Username"
              value={username}
              onChange={e=>setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white border-none rounded-md px-3 py-3 text-sm font-medium transition-colors ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gray-800 hover:bg-gray-700 cursor-pointer"
            }`}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-gray-800 no-underline font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}


