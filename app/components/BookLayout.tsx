"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  return (
    <div className="min-h-screen app-shell">
      {loggedIn ? (
        <>
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
        </>
      ) : (
        <header className="border-b border-white/5 sticky top-0 z-20 backdrop-blur-xl animate-fade-in" style={{ background: "rgba(12, 15, 20, 0.9)" }}>
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
            <Link href="/" className="font-heading text-xl font-medium text-slate-100 tracking-tight hover:text-[var(--accent)] transition-all duration-300">
              Hotel The Retinue & Buchiraju Conventions
            </Link>
            <nav className="flex flex-wrap gap-4 text-sm tracking-wide">
              <Link href="/rooms" className="nav-link text-slate-400 hover:text-[var(--accent)] transition-all duration-300">Rooms</Link>
              <Link href="/conventions" className="nav-link text-slate-400 hover:text-[var(--accent)] transition-all duration-300">Conventions</Link>
              <Link href="/contact" className="nav-link text-slate-400 hover:text-[var(--accent)] transition-all duration-300">Contact</Link>
              <Link href="/book" className="nav-link text-slate-400 hover:text-[var(--accent)] transition-all duration-300">Book a room</Link>
              <Link href="/my-booking" className="nav-link text-slate-400 hover:text-[var(--accent)] transition-all duration-300">View my booking</Link>
              <Link href="/blog" className="nav-link text-slate-400 hover:text-[var(--accent)] transition-all duration-300">Blog</Link>
              <Link href="/login" className="text-slate-400 hover:text-[var(--accent)] transition-all duration-300 nav-link">Log in</Link>
              <Link href="/signup" className="text-slate-400 hover:text-[var(--accent)] transition-all duration-300 nav-link">Sign up</Link>
            </nav>
          </div>
          {currentStep && (
            <div className="max-w-4xl mx-auto px-4 pb-2">
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
          )}
        </header>
      )}
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
