"use client";

import { useState } from "react";
import Link from "next/link";
import {
  sendOtp,
  verifyOtp,
  completeSignup,
  isApiError,
} from "@/lib/public-api";

type Step = "phone" | "otp" | "profile";

export default function SignupPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [signupToken, setSignupToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const phoneDigits = phone.replace(/\D/g, "").slice(-10);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (phoneDigits.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    const res = await sendOtp(phone);
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
    const res = await verifyOtp(phoneDigits, code);
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
    setLoading(true);
    const res = await completeSignup(signupToken, {
      name: name.trim(),
      email: email.trim() || undefined,
      address: address.trim() || undefined,
    });
    setLoading(false);
    if (isApiError(res)) {
      setError(res.message || res.error);
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen app-shell">
        <header className="app-header border-b">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold text-slate-100">
              Hotel The Retinue
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/book" className="text-slate-300 hover:text-sky-400 transition-colors">
                Book a room
              </Link>
              <Link href="/my-booking" className="text-slate-300 hover:text-sky-400 transition-colors">
                View my booking
              </Link>
              <Link href="/blog" className="text-slate-300 hover:text-sky-400 transition-colors">
                Blog
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-md mx-auto px-4 py-12">
          <div className="card p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-100 mb-2">Account created</h2>
            <p className="text-slate-400 text-sm mb-6">
              You’re signed up. You can now book a room or view your booking with this number.
            </p>
            <Link href="/book" className="btn-primary inline-block w-full py-3 text-center">
              Book a room
            </Link>
            <Link href="/" className="btn-secondary inline-block w-full py-3 text-center mt-3">
              Back to home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-shell">
      <header className="app-header border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-100">
            Hotel The Retinue
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/book" className="text-slate-300 hover:text-sky-400 transition-colors">
              Book a room
            </Link>
            <Link href="/my-booking" className="text-slate-300 hover:text-sky-400 transition-colors">
              View my booking
            </Link>
            <Link href="/blog" className="text-slate-300 hover:text-sky-400 transition-colors">
              Blog
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-md mx-auto px-4 py-8">
        <div className="card p-6">
          <h2 className="card-header text-xl font-semibold text-slate-100">
            Sign up
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {step === "phone" && "Enter your mobile number. We’ll send a one-time code."}
            {step === "otp" && `Enter the 6-digit code sent to ${phoneDigits.slice(0, 2)}******${phoneDigits.slice(-2)}.`}
            {step === "profile" && "Complete your profile."}
          </p>

          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="form-label">Mobile number (10 digits)</label>
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
                onClick={() => { setStep("phone"); setError(""); }}
                className="text-sm text-sky-400 hover:underline mb-4"
              >
                ← Change number
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
                <label className="form-label">Email (optional)</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
          Already have an account? You can{" "}
          <Link href="/my-booking" className="text-sky-400 hover:underline">
            view your booking
          </Link>{" "}
          with your reference and phone.
        </p>
      </main>
    </div>
  );
}
