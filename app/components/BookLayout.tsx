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

  const currentStepIndex = steps.findIndex((s) => s.path === currentStep);

  return (
    <div className="min-h-screen app-shell">
      <SiteHeader />
      {currentStep && (
        <div className="border-b bg-white" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between relative">
              {/* Connecting Line Background */}
              <div
                className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 bg-gray-200 -z-10"
                style={{ width: 'calc(100% - 3rem)', left: '1.5rem' }}
              />

              {/* Connecting Line Progress */}
              <div
                className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-[var(--accent)] -z-10 transition-all duration-500"
                style={{
                  width: `calc(${currentStepIndex / (steps.length - 1) * 100}% - 3rem)`,
                  left: '1.5rem'
                }}
              />

              {steps.map((s, idx) => {
                const isActive = idx === currentStepIndex;
                const isCompleted = idx < currentStepIndex;

                return (
                  <Link
                    key={s.path}
                    href={s.path}
                    className={`flex flex-col items-center gap-2 group ${idx > currentStepIndex ? 'pointer-events-none' : ''}`}
                  >
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                        transition-all duration-300 border-2
                        ${isActive
                          ? 'bg-[var(--accent)] border-[var(--accent)] text-white scale-110 shadow-lg'
                          : isCompleted
                            ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      className={`
                        text-xs font-medium tracking-wide transition-colors duration-300
                        ${isActive
                          ? 'text-[var(--accent)] scale-105'
                          : isCompleted
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }
                      `}
                    >
                      {s.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
