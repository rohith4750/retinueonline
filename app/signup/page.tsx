"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  sendOtp,
  verifyOtp,
  completeSignup,
  isApiError,
} from "@/lib/public-api";
import { setLoggedIn, setCustomerToken, setCustomerEmail } from "@/lib/auth";

type Step = "email" | "otp" | "profile";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const masked = local.length <= 2 ? local + "***" : local.slice(0, 2) + "***";
  return `${masked}@${domain}`;
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [signupToken, setSignupToken] = useState("");
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
    router.push("/dashboard");
    return;
  }

  return (
    <div className="min-h-screen app-shell">
      <header className="app-header border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <Link href="/" className="text-lg font-semibold text-slate-100">
            Hotel The Retinue
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link href="/rooms" className="text-slate-400 hover:text-[var(--accent)] transition-colors">Rooms</Link>
            <Link href="/conventions" className="text-slate-400 hover:text-[var(--accent)] transition-colors">Conventions</Link>
            <Link href="/contact" className="text-slate-400 hover:text-[var(--accent)] transition-colors">Contact</Link>
            <Link href="/book" className="text-slate-400 hover:text-[var(--accent)] transition-colors">Book a room</Link>
            <Link href="/my-booking" className="text-slate-400 hover:text-[var(--accent)] transition-colors">View my booking</Link>
            <Link href="/blog" className="text-slate-400 hover:text-[var(--accent)] transition-colors">Blog</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-md mx-auto px-4 py-8">
        <div className="card p-6">
          <h2 className="card-header text-xl font-semibold text-slate-100">
            Sign up
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {step === "email" && "Enter your email. We’ll send a one-time code."}
            {step === "otp" && `Enter the 6-digit code sent to ${maskEmail(email)}.`}
            {step === "profile" && "Complete your profile."}
          </p>

          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? "Sending…" : "Send OTP"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <>
              <button
                type="button"
                onClick={() => { setStep("email"); setError(""); }}
                className="text-sm text-[var(--accent)] hover:underline mb-4"
              >
                ← Change email
              </button>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="form-label">OTP (6 digits)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-input font-mono text-lg tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? "Verifying…" : "Verify OTP"}
                </button>
              </form>
            </>
          )}

          {step === "profile" && (
            <form onSubmit={handleCompleteSignup} className="space-y-4">
              <div>
                <label className="form-label">Full name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </div>
              <div>
                <label className="form-label">Phone (10 digits) *</label>
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
              <div>
                <label className="form-label">Address (optional)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                />
              </div>
              {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? "Saving…" : "Complete sign up"}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-slate-500 text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline">Log in</Link>
          {" · "}
          <Link href="/my-booking" className="text-[var(--accent)] hover:underline">View your booking</Link>
        </p>
      </main>
    </div>
  );
}
