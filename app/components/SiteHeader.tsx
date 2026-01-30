"use client";

import Link from "next/link";
import { HOTEL } from "@/lib/site-content";

const nav = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/conventions", label: "Conventions" },
  { href: "/contact", label: "Contact" },
  { href: "/book", label: "Book a room" },
  { href: "/login", label: "Log in" },
  { href: "/signup", label: "Sign up" },
];

export default function SiteHeader() {
  return (
    <header className="app-header border-b border-white/5 sticky top-0 z-20 backdrop-blur-xl animate-fade-in" style={{ background: "rgba(12, 15, 20, 0.9)" }}>
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <Link href="/" className="font-heading text-base sm:text-lg md:text-xl font-medium text-slate-100 tracking-tight hover:text-[var(--accent)] transition-all duration-300 shrink-0">
          {HOTEL.name}
        </Link>
        <nav className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm tracking-wide">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="nav-link text-slate-400 hover:text-[var(--accent)] transition-all duration-300 py-1 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:py-0 flex items-center justify-center sm:justify-start"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
