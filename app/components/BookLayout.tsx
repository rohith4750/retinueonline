"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteHeader from "./SiteHeader";
import { isLoggedIn } from "@/lib/auth";

const steps = [
  { path: "/book", label: "Dates" },
  { path: "/book/rooms", label: "Select Room" },
  { path: "/book/checkout", label: "Guest Details" },
  { path: "/book/confirmation", label: "Confirmation" },
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
        <p style={{ color: "var(--muted)" }}>Redirecting to login…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-shell">
      <SiteHeader />
      {currentStep && (
        <div className="border-b" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex gap-2 text-xs" style={{ color: "var(--muted)" }}>
              {steps.map((s, idx) => (
                <span key={s.path} className="contents">
                  <Link
                    href={s.path}
                    className={
                      currentStep === s.path
                        ? "font-semibold hover:underline"
                        : "hover:text-[var(--accent)]"
                    }
                    style={{ color: currentStep === s.path ? "var(--accent)" : "inherit" }}
                  >
                    {s.label}
                  </Link>
                  {idx < steps.length - 1 && (
                    <span>→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
