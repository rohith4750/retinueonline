"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  sendOtp,
  verifyOtp,
  completeSignup,
  isApiError,
} from "@/lib/public-api";
import { setLoggedIn, setCustomerToken, setCustomerEmail } from "@/lib/auth";
import { getYearsOfOperation } from "@/lib/site-content";
import SiteHeader from "../components/SiteHeader";

type Step = "email" | "otp" | "profile";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const masked = local.length <= 2 ? local + "***" : local.slice(0, 2) + "***";
  return `${masked}@${domain}`;
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [signupToken, setSignupToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

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
    setSignupToken(res.data.signupToken);
    setStep("profile");
    setError("");
  }

  async function handleCompleteSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    const phoneDigits = phone.replace(/\D/g, "").slice(-10);
    if (phoneDigits.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    const res = await completeSignup(signupToken, {
      name: name.trim(),
      phone: phoneDigits,
      address: address.trim() || undefined,
    });
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
          <div className="absolute top-8 right-8 w-24 h-24 opacity-10">
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

          {/* Offerings */}
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg text-left">
            <div className="card p-4">
              <p className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: "var(--accent)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }}></span>
                Hotel The Retinue
              </p>
              <ul className="text-xs space-y-1" style={{ color: "var(--foreground)" }}>
                <li>• Standard Rooms</li>
                <li>• Suites & Suite+</li>
                <li>• 12-24 Hour Stay</li>
                <li>• Transparent Pricing</li>
              </ul>
            </div>
            <div className="card p-4">
              <p className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: "var(--accent)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }}></span>
                Conventions
              </p>
              <ul className="text-xs space-y-1" style={{ color: "var(--foreground)" }}>
                <li>• Wedding Functions</li>
                <li>• Birthday & Anniversary</li>
                <li>• Corporate Meetings</li>
                <li>• Private Events</li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="text-xs space-y-1 mb-8" style={{ color: "var(--muted)" }}>
            <p className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              767 580 0901
            </p>
            <p className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              hoteltheretinue@gmail.com
            </p>
            <p>Ramachandrapuram, Andhra Pradesh - 533255</p>
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto" style={{ background: "var(--background)" }}>
        <div className="w-full max-w-md my-8">
          <div className="lg:hidden mb-8 text-center">
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--accent)" }}>HOTEL</p>
            <h2 className="font-heading text-2xl font-light" style={{ color: "var(--accent)" }}>
              THE RETINUE
            </h2>
            <p className="text-sm" style={{ color: "var(--foreground)" }}>& Buchiraju Conventions</p>
          </div>

          <div className="mb-8">
            {step === "profile" ? (
              <>
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>MEMBERSHIP</span>
                <h1 className="font-heading text-3xl sm:text-4xl font-light mb-2" style={{ color: "var(--foreground)" }}>
                  Join the Community
                </h1>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Create your account to start booking and unlock exclusive offers
                </p>
              </>
            ) : step === "otp" ? (
              <>
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>SECURITY VERIFICATION</span>
                <h1 className="font-heading text-3xl sm:text-4xl font-light mb-2" style={{ color: "var(--foreground)" }}>
                  Verify Your Account
                </h1>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  We have sent a 6-digit code to {maskEmail(email)}
                </p>
              </>
            ) : (
              <>
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>MEMBERSHIP</span>
                <h1 className="font-heading text-3xl sm:text-4xl font-light mb-2" style={{ color: "var(--foreground)" }}>
                  Join the Community
                </h1>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Create your account to start booking and unlock exclusive offers
                </p>
              </>
            )}
          </div>

          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="form-label text-xs uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
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
              <div>
                <label className="form-label text-xs uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" required />
                  <span>I agree to the Terms of Service and Privacy Policy. I understand the cancellation policy for this booking.</span>
                </label>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading ? "Sending…" : "Create My Account"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <>
              <button
                type="button"
                onClick={() => { setStep("email"); setError(""); }}
                className="text-sm text-[var(--accent)] hover:underline mb-6"
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
                {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                  {loading ? "Verifying…" : "Verify & Continue"}
                </button>
              </form>
            </>
          )}

          {step === "profile" && (
            <form onSubmit={handleCompleteSignup} className="space-y-5">
              <div>
                <label className="form-label text-xs uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="form-label text-xs uppercase tracking-wider">Phone (10 digits)</label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  maxLength={10}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading ? "Saving…" : "Complete Sign Up"}
              </button>
            </form>
          )}

          <p className="text-center text-sm mt-8" style={{ color: "var(--muted)" }}>
            Already have an account? <Link href={searchParams.get("redirect") ? `/login?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : "/login"} className="text-[var(--accent)] hover:underline font-medium">Login</Link>
          </p>

          <div className="flex justify-center gap-6 mt-8 text-xs" style={{ color: "var(--muted)" }}>
            <Link href="#" className="hover:text-[var(--accent)]">SUPPORT</Link>
            <Link href="#" className="hover:text-[var(--accent)]">PRIVACY</Link>
            <Link href="#" className="hover:text-[var(--accent)]">JOURNAL</Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)", color: "var(--muted)" }}>Loading…</div>}>
      <SignupForm />
    </Suspense>
  );
}
