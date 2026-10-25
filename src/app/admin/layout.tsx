"use client";

import { usePathname } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { AuthProvider } from "@/components/admin/AuthProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AuthProvider>
      {pathname.startsWith("/admin/login") ? children : <AdminShell>{children}</AdminShell>}
    </AuthProvider>
  );
}
