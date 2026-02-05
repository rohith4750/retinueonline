"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HOTEL } from "@/lib/site-content";
import { isLoggedIn, getCustomerEmail } from "@/lib/auth";

const nav = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/conventions", label: "Convention" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Get initials from email
function getInitials(email: string): string {
  if (!email) return "U";
  const name = email.split("@")[0];
  return name.charAt(0).toUpperCase();
}

// Get display name from email
function getDisplayName(email: string): string {
  if (!email) return "User";
  const name = email.split("@")[0];
  // Capitalize first letter and add initial if possible
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const lastInitial = parts[1].charAt(0).toUpperCase();
    return `${firstName} ${lastInitial}.`;
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setUserEmail(getCustomerEmail() || "");
  }, [pathname]);

  return (
    <header className="border-b sticky top-0 z-20 bg-white shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "var(--accent)" }}>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 8V16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M8 12L16 16L24 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
            {HOTEL.name}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map(({ href, label }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="relative text-sm font-medium transition-colors hover:text-[var(--accent)] pb-1"
                style={{ color: isActive ? "var(--accent)" : "var(--foreground)" }}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {loggedIn ? (
            /* User Profile Button */
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2 rounded-full border transition-all hover:shadow-md"
              style={{
                borderColor: "var(--border)",
                background: "white"
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{
                  background: "linear-gradient(135deg, #FFB84D 0%, var(--accent) 100%)"
                }}
              >
                {getInitials(userEmail)}
              </div>
              <span className="font-medium text-sm hidden sm:block" style={{ color: "var(--foreground)" }}>
                {getDisplayName(userEmail)}
              </span>
            </Link>
          ) : (
            /* Guest Buttons */
            <>
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 hover:text-[var(--accent)] transition-colors hidden sm:block"
                style={{ color: "var(--foreground)" }}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium px-4 py-2 hover:text-[var(--accent)] transition-colors hidden sm:block"
                style={{ color: "var(--foreground)" }}
              >
                Sign Up
              </Link>
              <Link
                href="/book"
                className="btn-primary px-5 py-2 text-sm font-medium"
              >
                Book Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>
  );
}
