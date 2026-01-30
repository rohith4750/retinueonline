"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PrivateHeader from "./PrivateHeader";
import { isLoggedIn } from "@/lib/auth";

const steps = [
  { path: "/book", label: "Dates" },
  { path: "/book/rooms", label: "Room" },
  { path: "/book/checkout", label: "Details" },
  { path: "/book/confirmation", label: "Confirm" },
];

export default function BookLayout({
  children,
  currentStep,
}: {
  children: React.ReactNode;
  currentStep?: string;
}) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      const returnTo =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/book";
      router.replace(`/login?redirect=${encodeURIComponent(returnTo)}`);
      return;
    }
    setLoggedIn(true);
    setChecking(false);
  }, [router]);

  if (checking || !loggedIn) {
    return (
      <div className="min-h-screen app-shell flex items-center justify-center">
        <p className="text-slate-400">Redirecting to login…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-shell">
      <PrivateHeader title="Hotel The Retinue & Buchiraju Conventions" />
      {currentStep && (
        <div className="border-b border-white/5" style={{ background: "rgba(12, 15, 20, 0.9)" }}>
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex gap-2 text-xs text-slate-400">
              {steps.map((s) => (
                <span key={s.path} className="contents">
                  <Link
                    href={s.path}
                    className={
                      currentStep === s.path
                        ? "text-[var(--accent)] font-medium"
                        : "hover:text-slate-300"
                    }
                  >
                    {s.label}
                  </Link>
                  {steps.indexOf(s) < steps.length - 1 && (
                    <span className="text-slate-600">/</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
