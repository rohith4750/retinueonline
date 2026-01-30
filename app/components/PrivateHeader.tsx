"use client";

import Link from "next/link";

/** Minimal header for private (post-login) area: no main site nav, only Dashboard and Log out. */
export default function PrivateHeader({
  title = "Hotel The Retinue",
  showDashboardLink = true,
}: {
  title?: string;
  showDashboardLink?: boolean;
}) {
  return (
    <header
      className="border-b border-white/5 sticky top-0 z-20 backdrop-blur-xl"
      style={{ background: "rgba(12, 15, 20, 0.9)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href={showDashboardLink ? "/dashboard" : "/"}
          className="font-heading text-xl font-medium text-slate-100 tracking-tight hover:text-[var(--accent)] transition-all duration-300"
        >
          {title}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {showDashboardLink && (
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-[var(--accent)] transition-colors"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/logout"
            className="text-slate-400 hover:text-[var(--accent)] transition-colors"
          >
            Log out
          </Link>
        </nav>
      </div>
    </header>
  );
}
