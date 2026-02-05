"use client";

import { useEffect, useState, useRef } from "react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setUserEmail(getCustomerEmail() || "");
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            /* User Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
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
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  style={{ color: "var(--muted)" }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg border overflow-hidden"
                  style={{ 
                    background: "white",
                    borderColor: "var(--border)"
                  }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      {getDisplayName(userEmail)}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                      {userEmail}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      style={{ color: "var(--foreground)" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                      Dashboard
                    </Link>
                    
                    <Link
                      href="/my-booking"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      style={{ color: "var(--foreground)" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                      My Bookings
                    </Link>
                    
                    <div className="border-t my-1" style={{ borderColor: "var(--border)" }}></div>
                    
                    <Link
                      href="/logout"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-red-50"
                      style={{ color: "#EF4444" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>
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
