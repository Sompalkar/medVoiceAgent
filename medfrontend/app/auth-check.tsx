"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        await axios.get(`${BACKEND}/api/auth/me`, { withCredentials: true });
        setIsAuth(true);
      } catch {
        setIsAuth(false);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-base text-gray-600">
        Loading...
      </div>
    );
  }

  return isAuth ? <>{children}</> : null;
}
