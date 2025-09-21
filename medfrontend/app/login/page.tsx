"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post(
        `${BACKEND}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      router.push("/dashboard/bots");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <form onSubmit={onSubmit} className="border border-gray-200 rounded-xl p-8 bg-white shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-sm text-gray-600 mb-6">Access your medical AI dashboard</p>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-gray-800 no-underline font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}


