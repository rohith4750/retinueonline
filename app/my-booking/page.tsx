"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SiteHeader from "../components/SiteHeader";
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
      <SiteHeader />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="card p-6 sm:p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-light mb-2" style={{ color: "var(--foreground)", fontFamily: "var(--font-serif)" }}>
            View My Booking
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            Enter your booking details to view and manage your reservation
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label text-xs uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="form-label text-xs uppercase tracking-wider">Booking Reference</label>
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
              <label className="form-label text-xs uppercase tracking-wider">Phone Number</label>
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
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? "Loading…" : "View Booking"}
            </button>
          </form>
        </div>

        {booking && (
          <div className="card p-6 sm:p-8 max-w-2xl mx-auto mt-8">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
              <h3 className="text-xl font-light" style={{ color: "var(--foreground)", fontFamily: "var(--font-serif)" }}>
                Booking Details
              </h3>
              <span
                className={`badge ${statusBadge[booking.status] ?? "badge-gray"}`}
              >
                {booking.status}
              </span>
            </div>
            <div className="rounded-xl p-4 mb-6" style={{ background: "var(--accent-soft)" }}>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
                Booking Reference
              </p>
              <p className="text-2xl font-mono font-bold text-[var(--accent)]">
                {booking.bookingReference}
              </p>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt style={{ color: "var(--muted)" }}>Guest Name</dt>
                <dd className="font-medium" style={{ color: "var(--foreground)" }}>{booking.guestName}</dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: "var(--muted)" }}>Phone</dt>
                <dd className="font-medium" style={{ color: "var(--foreground)" }}>{booking.guestPhone}</dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: "var(--muted)" }}>Check-in</dt>
                <dd className="font-medium" style={{ color: "var(--foreground)" }}>{formatDate(booking.checkIn)}</dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: "var(--muted)" }}>Check-out</dt>
                <dd className="font-medium" style={{ color: "var(--foreground)" }}>{formatDate(booking.checkOut)}</dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: "var(--muted)" }}>
                  {booking.isBatch && booking.rooms ? "Rooms" : "Room"}
                </dt>
                <dd className="font-medium" style={{ color: "var(--foreground)" }}>
                  {booking.isBatch && booking.rooms ? (
                    <div className="space-y-2 text-right">
                      {booking.rooms.map((room, idx) => (
                        <div key={room.roomId} className="flex flex-col items-end">
                          <span>{room.roomNumber} · {room.roomType.replace('_', ' ')}</span>
                          <span className="text-xs" style={{ color: "var(--muted)" }}>
                            {formatCurrency(room.basePrice)} per night
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span>{booking.roomNumber} · {booking.roomType}</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: "var(--muted)" }}>Number of Guests</dt>
                <dd className="font-medium" style={{ color: "var(--foreground)" }}>{booking.numberOfGuests}</dd>
              </div>
              <div className="flex justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <dt style={{ color: "var(--muted)" }}>Total Amount</dt>
                <dd className="font-bold" style={{ color: "var(--foreground)" }}>
                  {formatCurrency(booking.totalAmount)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: "var(--muted)" }}>Amount Paid</dt>
                <dd className="font-medium" style={{ color: "var(--accent)" }}>
                  {formatCurrency(booking.paidAmount)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: "var(--muted)" }}>Balance Due</dt>
                <dd className="font-medium" style={{ color: booking.balanceAmount > 0 ? "var(--accent)" : "var(--foreground)" }}>
                  {formatCurrency(booking.balanceAmount)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: "var(--muted)" }}>Payment Status</dt>
                <dd className="font-medium" style={{ color: "var(--foreground)" }}>{booking.paymentStatus}</dd>
              </div>
            </dl>
            <div className="mt-6 pt-4 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
              <Link href="/book" className="btn-primary w-full text-center py-3">
                Book Another Room
              </Link>
              <Link href="/" className="btn-secondary w-full text-center py-3">
                Back to Home
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
