import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <aside className="border-r p-4 space-y-4">
        <h2 className="font-semibold">Admin</h2>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/dashboard/bots" className="hover:underline">Bots</Link>
          <Link href="/dashboard/calls" className="hover:underline">Calls</Link>
          <Link href="/dashboard/patients" className="hover:underline">Patients</Link>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}


