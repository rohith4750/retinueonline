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
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
        <Link href="/" className="font-heading text-xl font-medium text-slate-100 tracking-tight hover:text-[var(--accent)] transition-all duration-300">
          {HOTEL.name}
        </Link>
        <nav className="flex flex-wrap gap-6 text-sm tracking-wide">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="nav-link text-slate-400 hover:text-[var(--accent)] transition-all duration-300"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
