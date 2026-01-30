"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearLoggedIn } from "@/lib/auth";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    clearLoggedIn();
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen app-shell flex items-center justify-center">
      <p className="text-slate-400">Logging out…</p>
    </div>
  );
}
