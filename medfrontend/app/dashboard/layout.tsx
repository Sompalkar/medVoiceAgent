"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import AuthCheck from "../auth-check";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await axios.post(`${BACKEND}/api/auth/logout`, {}, { withCredentials: true });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/");
    }
  }

  return (
    <AuthCheck>
      <div className="min-h-screen grid grid-cols-[240px_1fr]">
        <aside className="border-r border-gray-200 p-6 bg-gradient-to-b from-white to-purple-50">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900">MedicalAI Agent</h2>
            <p className="text-xs text-purple-600 mt-1">Dashboard</p>
          </div>
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard/bots" className="px-4 py-3 rounded-lg no-underline text-gray-700 text-sm font-medium transition-colors hover:bg-purple-100 hover:text-purple-800">
              AI Bots
            </Link>
            <Link href="/dashboard/calls" className="px-4 py-3 rounded-lg no-underline text-gray-700 text-sm font-medium transition-colors hover:bg-purple-100 hover:text-purple-800">
              Call History
            </Link>
            <Link href="/dashboard/patients" className="px-4 py-3 rounded-lg no-underline text-gray-700 text-sm font-medium transition-colors hover:bg-purple-100 hover:text-purple-800">
              Test Patients
            </Link>
          </nav>
          <div className="mt-auto pt-10">
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-transparent text-gray-600 text-sm cursor-pointer transition-colors hover:bg-red-50 hover:border-red-300 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </aside>
        <main className="p-8">{children}</main>
      </div>
    </AuthCheck>
  );
}


