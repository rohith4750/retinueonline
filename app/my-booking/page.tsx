"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PrivateHeader from "../components/PrivateHeader";
import { isLoggedIn, getCustomerEmail } from "@/lib/auth";
import {
  publicApi,
  isApiError,
  formatDate,
  formatCurrency,
  type ViewBookingData,
} from "@/lib/public-api";

const statusBadge: Record<string, string> = {
  CONFIRMED: "badge-success",
  PENDING: "badge-warning",
  CANCELLED: "badge-danger",
  CHECKED_IN: "badge-info",
  CHECKED_OUT: "badge-gray",
};

function doLookup(
  ref: string,
  ph: string,
  setError: (s: string) => void,
  setBooking: (b: ViewBookingData | null) => void,
  setLoading: (v: boolean) => void
) {
  setError("");
  setBooking(null);
  setLoading(true);
  const params = new URLSearchParams({
    bookingReference: ref.trim().toUpperCase(),
    phone: ph.trim().replace(/\D/g, ""),
  });
  publicApi<ViewBookingData>(`/bookings/by-reference?${params.toString()}`)
    .then((res) => {
      if (isApiError(res)) {
        setError(res.message || res.error);
        return;
      }
      setBooking(res.data);
    })
    .catch(() => setError("Unable to load booking. Please try again."))
    .finally(() => setLoading(false));
}

function MyBookingContent() {
  const searchParams = useSearchParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<ViewBookingData | null>(null);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    const stored = getCustomerEmail();
    if (stored) setEmail(stored);
  }, []);

  useEffect(() => {
    const ref = searchParams.get("ref") ?? "";
    const ph = searchParams.get("phone") ?? "";
    const em = searchParams.get("email") ?? "";
    if (ref) setReference(ref);
    if (ph) setPhone(ph);
    if (em) setEmail(em);
    if (ref && ph && ref.trim() && ph.trim().replace(/\D/g, "").length >= 4) {
      doLookup(ref, ph, setError, setBooking, setLoading);
    }
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = reference.trim().toUpperCase();
    const ph = phone.trim().replace(/\D/g, "");
    if (!ref || !ph) {
      setError("Please enter booking reference and phone number.");
      return;
    }
    if (ph.length < 4) {
      setError("Enter full 10-digit phone or last 4 digits.");
      return;
    }
    doLookup(reference, phone, setError, setBooking, setLoading);
  }

  return (
    <div className="min-h-screen app-shell">
      {loggedIn ? (
        <PrivateHeader />
      ) : (
        <header className="app-header border-b" style={{ background: "rgba(12, 15, 20, 0.9)" }}>
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
            <Link href="/" className="text-lg font-semibold text-slate-100">
              Hotel The Retinue
            </Link>
            <nav className="flex flex-wrap gap-3 text-sm">
              <Link href="/rooms" className="text-slate-400 hover:text-[var(--accent)] transition-colors">Rooms</Link>
              <Link href="/conventions" className="text-slate-400 hover:text-[var(--accent)] transition-colors">Conventions</Link>
              <Link href="/contact" className="text-slate-400 hover:text-[var(--accent)] transition-colors">Contact</Link>
              <Link href="/book" className="text-slate-400 hover:text-[var(--accent)] transition-colors">Book a room</Link>
              <Link href="/blog" className="text-slate-400 hover:text-[var(--accent)] transition-colors">Blog</Link>
              <Link href="/login" className="text-slate-400 hover:text-[var(--accent)] transition-all duration-300">Log in</Link>
              <Link href="/signup" className="text-slate-400 hover:text-[var(--accent)] transition-all duration-300">Sign up</Link>
              <span className="text-[var(--accent)] font-medium">View my booking</span>
            </nav>
          </div>
        </header>
      )}

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="card p-6 max-w-md mx-auto">
          <h2 className="card-header text-xl font-semibold text-slate-100">
            View my booking
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            Email is used as priority. Enter your email, booking reference, and phone used at booking.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email (priority)</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="form-label">Booking reference</label>
              <input
                type="text"
                className="form-input font-mono uppercase"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. ABC12XY7"
                maxLength={12}
              />
            </div>
            <div>
              <label className="form-label">Phone number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10 digits or last 4 digits"
                maxLength={10}
              />
            </div>
            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? "Loading…" : "View booking"}
            </button>
          </form>
        </div>

        {booking && (
          <div className="card p-6 max-w-lg mx-auto mt-8">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <h3 className="text-lg font-semibold text-slate-100">
                Booking details
              </h3>
              <span
                className={`badge ${statusBadge[booking.status] ?? "badge-gray"}`}
              >
                {booking.status}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Reference
              </p>
              <p className="text-xl font-mono font-semibold text-[var(--accent)]">
                {booking.bookingReference}
              </p>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">Guest</dt>
                <dd className="text-slate-100">{booking.guestName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Phone</dt>
                <dd className="text-slate-100">{booking.guestPhone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Check-in</dt>
                <dd className="text-slate-100">{formatDate(booking.checkIn)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Check-out</dt>
                <dd className="text-slate-100">{formatDate(booking.checkOut)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Room</dt>
                <dd className="text-slate-100">
                  {booking.roomNumber} · {booking.roomType}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Guests</dt>
                <dd className="text-slate-100">{booking.numberOfGuests}</dd>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5">
                <dt className="text-slate-400">Total</dt>
                <dd className="text-slate-100">
                  {formatCurrency(booking.totalAmount)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Paid</dt>
                <dd className="text-slate-100">
                  {formatCurrency(booking.paidAmount)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Balance</dt>
                <dd className="text-slate-100 font-medium">
                  {formatCurrency(booking.balanceAmount)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Payment status</dt>
                <dd className="text-slate-100">{booking.paymentStatus}</dd>
              </div>
            </dl>
            <div className="mt-6 pt-4 border-t border-white/5">
              <Link href="/book" className="btn-secondary w-full text-center">
                Book another room
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function MyBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen app-shell flex items-center justify-center">
          <p className="text-slate-400">Loading…</p>
        </div>
      }
    >
      <MyBookingContent />
    </Suspense>
  );
}
