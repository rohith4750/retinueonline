"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { sendOtp, verifyOtp, isApiError } from "@/lib/public-api";
import { setLoggedIn, setCustomerToken, setCustomerEmail } from "@/lib/auth";

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
    <div className="min-h-screen app-shell animate-fade-in">
      <header className="border-b border-white/5 py-4" style={{ background: "rgba(12, 15, 20, 0.9)" }}>
        <div className="w-full max-w-6xl mx-auto px-4 flex items-center flex-nowrap">
          <span className="flex-1 min-w-0" aria-hidden />
          <span className="font-heading text-lg font-medium text-slate-100 shrink-0 whitespace-nowrap">Hotel The Retinue & Buchiraju Conventions</span>
          <span className="flex-1 min-w-0 flex justify-end">
            <Link
              href="/"
              className="text-sm text-[var(--accent)] hover:underline transition-colors whitespace-nowrap"
            >
              Back to home →
            </Link>
          </span>
        </div>
      </header>
      <main className="max-w-md mx-auto px-4 py-12 animate-slide-up">
        <div className="card p-6">
          <h2 className="card-header font-heading text-2xl font-medium text-slate-100">
            Log in
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {step === "email" && "Enter your email. We'll send a verification code."}
            {step === "otp" && `Enter the 6-digit code sent to ${maskEmail(email)}.`}
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
              {error && <p className="text-sm text-red-400 animate-fade-in" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100">
                {loading ? "Sending…" : "Send OTP"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <>
              <button
                type="button"
                onClick={() => { setStep("email"); setError(""); }}
                className="text-sm text-[var(--accent)] hover:underline mb-4 transition-all duration-200"
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
                {error && <p className="text-sm text-red-400 animate-fade-in" role="alert">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100">
                  {loading ? "Verifying…" : "Log in"}
                </button>
              </form>
            </>
          )}
        </div>
        <p className="text-center text-slate-500 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href={searchParams.get("redirect") ? `/signup?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : "/signup"}
            className="text-[var(--accent)] hover:underline transition-colors"
          >
            Sign up
          </Link>
        </p>
      </main>
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
