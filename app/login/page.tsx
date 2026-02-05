"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { sendOtp, verifyOtp, isApiError } from "@/lib/public-api";
import { setLoggedIn, setCustomerToken, setCustomerEmail } from "@/lib/auth";
import { getYearsOfOperation } from "@/lib/site-content";
import SiteHeader from "../components/SiteHeader";
import styles from "./page.module.scss";

type Step = "email" | "otp";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const masked = local.length <= 2 ? local + "***" : local.slice(0, 2) + "***";
  return `${masked}@${domain}`;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    const res = await sendOtp(trimmed);
    setLoading(false);
    if (isApiError(res)) {
      setError(res.message || res.error);
      return;
    }
    setStep("otp");
    setOtp("");
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const code = otp.replace(/\D/g, "");
    if (code.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    const res = await verifyOtp(email.trim().toLowerCase(), code);
    setLoading(false);
    if (isApiError(res)) {
      setError(res.message || res.error);
      return;
    }
    if (res.data.customerToken) {
      setCustomerToken(res.data.customerToken);
    }
    setCustomerEmail(email.trim().toLowerCase());
    setLoggedIn();
    const returnTo = searchParams.get("redirect") || "/dashboard";
    router.push(returnTo.startsWith("/") ? returnTo : "/dashboard");
    return;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex">
      {/* Left Side - Hotel Info */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: "#F5F1E8" }}>
        <div className="w-full p-12 flex flex-col justify-center items-center text-center">
          {/* Decorative lines */}
          <div className="absolute top-8 left-8 w-24 h-24 opacity-10">
            <svg viewBox="0 0 100 100" fill="none" stroke="var(--accent)" strokeWidth="1">
              <circle cx="50" cy="50" r="45" />
              <circle cx="50" cy="50" r="35" />
              <circle cx="50" cy="50" r="25" />
            </svg>
          </div>

          {/* Header */}
          <div className="mb-12">
            <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>HOTEL</p>
            <h1 className="font-heading text-4xl font-light mb-2" style={{ color: "var(--accent)" }}>
              THE RETINUE
            </h1>
            <p className="text-lg mb-4" style={{ color: "var(--foreground)" }}>&</p>
            <p className="text-xl uppercase tracking-wider mb-6" style={{ color: "var(--foreground)" }}>
              BUCHIRAJU CONVENTIONS
            </p>
            <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--muted)" }}>
              Comfortable stays & elegant celebrations in Ramachandrapuram
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px w-20" style={{ background: "var(--accent)" }}></div>
            <span style={{ color: "var(--accent)" }}>★</span>
            <div className="h-px w-20" style={{ background: "var(--accent)" }}></div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12 max-w-lg">
            <div className="card p-4">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
              <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{getYearsOfOperation()}+</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Premium Hospitality</p>
            </div>
            <div className="card p-4">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>1K+</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Happy Guests</p>
            </div>
            <div className="card p-4">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>500+</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Events Hosted</p>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-auto">
            <p className="text-sm italic" style={{ color: "var(--muted)" }}>
              <span style={{ color: "var(--accent)" }}>❤</span>
              {" "}"Stay with comfort, celebrate with elegance."{" "}
              <span style={{ color: "var(--accent)" }}>❤</span>
            </p>
          </div>

          {/* Back to home link */}
          <Link href="/" className="mt-8 text-sm hover:text-[var(--accent)] transition-colors" style={{ color: "var(--muted)" }}>
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative" style={{ background: "var(--background)" }}>
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--accent)" }}>HOTEL</p>
            <h2 className="font-heading text-2xl font-light" style={{ color: "var(--accent)" }}>
              THE RETINUE
            </h2>
            <p className="text-sm" style={{ color: "var(--foreground)" }}>& Buchiraju Conventions</p>
          </div>

          <div className="mb-8">
            <h1 className="font-heading text-3xl sm:text-4xl font-light mb-2" style={{ color: "var(--foreground)" }}>
              Welcome Back!!
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {step === "email" && "Enter your email address and we'll send you a verification code"}
              {step === "otp" && `We have sent a 6-digit code to ${maskEmail(email)}`}
            </p>
          </div>

          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="form-label text-xs uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600 animate-fade-in" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading ? "Sending…" : "Login"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <>
              <button
                type="button"
                onClick={() => { setStep("email"); setError(""); }}
                className="text-sm text-[var(--accent)] hover:underline mb-6 transition-all duration-200"
              >
                ← Change email address
              </button>
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="form-label text-xs uppercase tracking-wider">Enter Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-input font-mono text-2xl tracking-widest text-center"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
                  Didn't receive the code? <button type="button" className="text-[var(--accent)] hover:underline">Resend Code</button>
                </p>
                {error && <p className="text-sm text-red-600 animate-fade-in" role="alert">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                  {loading ? "Verifying…" : "Verify & Continue"}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm mt-8" style={{ color: "var(--muted)" }}>
            Don't have an account? <Link href={searchParams.get("redirect") ? `/signup?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : "/signup"} className="text-[var(--accent)] hover:underline font-medium">Sign Up</Link>
          </p>

          <div className="flex justify-center gap-6 mt-8 text-xs" style={{ color: "var(--muted)" }}>
            <Link href="#" className="hover:text-[var(--accent)]">SUPPORT</Link>
            <Link href="#" className="hover:text-[var(--accent)]">PRIVACY</Link>
            <Link href="#" className="hover:text-[var(--accent)]">GENERAL</Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen app-shell flex items-center justify-center text-slate-400">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
