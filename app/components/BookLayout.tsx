"use client";

import Link from "next/link";

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
  return (
    <div className="min-h-screen app-shell">
      <header className="app-header border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-100">
            Hotel The Retinue
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/book"
              className="text-slate-300 hover:text-sky-400 transition-colors"
            >
              Book a room
            </Link>
            <Link
              href="/my-booking"
              className="text-slate-300 hover:text-sky-400 transition-colors"
            >
              View my booking
            </Link>
            <Link
              href="/blog"
              className="text-slate-300 hover:text-sky-400 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/signup"
              className="text-slate-300 hover:text-sky-400 transition-colors"
            >
              Sign up
            </Link>
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
                        ? "text-sky-400 font-medium"
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
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
