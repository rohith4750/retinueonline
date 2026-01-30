"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function MyBookingPage() {
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<ViewBookingData | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBooking(null);
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
    setLoading(true);
    const params = new URLSearchParams({
      bookingReference: ref,
      phone: ph,
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

  return (
    <div className="min-h-screen app-shell">
      <header className="app-header border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-100">
            Hotel The Retinue
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/book"
              className="text-slate-300 hover:text-sky-400 transition-colors"
            >
              Book a room
            </Link>
            <Link
              href="/blog"
              className="text-slate-300 hover:text-sky-400 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/signup"
              className="text-slate-300 hover:text-sky-400 transition-colors"
            >
              Sign up
            </Link>
            <span className="text-sky-400 font-medium">View my booking</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="card p-6 max-w-md mx-auto">
          <h2 className="card-header text-xl font-semibold text-slate-100">
            View my booking
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            Enter the booking reference from your confirmation and the phone
            number used at booking.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <p className="text-xl font-mono font-semibold text-sky-400">
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
