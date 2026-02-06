"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HOTEL } from "@/lib/site-content";
import { isLoggedIn, getCustomerEmail } from "@/lib/auth";
import Logo from "./Logo";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 md:gap-5 min-w-0 flex-shrink">
            <Link href="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
              <Logo />
            </Link>
            <div className="hidden md:block font-heading text-base lg:text-lg xl:text-xl font-semibold tracking-tight whitespace-nowrap">
              <span style={{ color: "var(--foreground)" }}>Hotel </span>
              <span style={{ color: "var(--accent)" }}>The Retinue</span>
              <span className="text-xs lg:text-sm" style={{ color: "var(--muted)" }}> & Buchiraju Convention</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {nav.map(({ href, label }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative text-sm font-medium transition-colors hover:text-[var(--accent)] pb-1 whitespace-nowrap"
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
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
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
              <div className="hidden md:flex items-center gap-1 border rounded-full px-2 py-1 whitespace-nowrap" style={{ borderColor: "var(--border)" }}>
                <Link
                  href="/login"
                  className="text-xs md:text-sm font-medium px-2 md:px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap"
                  style={{ color: "var(--foreground)" }}
                >
                  Login
                </Link>
                <span className="text-xs" style={{ color: "var(--border)" }}>/</span>
                <Link
                  href="/signup"
                  className="text-xs md:text-sm font-medium px-2 md:px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap"
                  style={{ color: "var(--foreground)" }}
                >
                  Sign Up
                </Link>
              </div>
              <Link
                href="/book"
                className="btn-primary px-3 md:px-5 py-1.5 md:py-2 text-xs md:text-sm font-medium whitespace-nowrap"
              >
                Book Now
              </Link>
            </>
          )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors" 
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4 space-y-1">
            {nav.map(({ href, label }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 rounded-md"
                  style={{ 
                    color: isActive ? "var(--accent)" : "var(--foreground)",
                    backgroundColor: isActive ? "rgba(218, 165, 32, 0.05)" : "transparent"
                  }}
                >
                  {label}
                </Link>
              );
            })}
            
            {!loggedIn && (
              <div className="pt-3 mt-3 border-t space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 rounded-md text-center"
                  style={{ color: "var(--foreground)" }}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 rounded-md text-center"
                  style={{ color: "var(--foreground)" }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
