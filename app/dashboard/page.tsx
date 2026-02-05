"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteHeader from "../components/SiteHeader";
import { isLoggedIn, getCustomerToken, getCustomerEmail } from "@/lib/auth";
import {
  getBookingHistory,
  isApiError,
  formatDate,
  formatCurrency,
  type BookingHistoryItem,
} from "@/lib/public-api";

const statusBadge: Record<string, string> = {
  CONFIRMED: "bg-emerald-500/20 text-emerald-400",
  PENDING: "bg-amber-500/20 text-amber-400",
  CANCELLED: "bg-red-500/20 text-red-400",
  CHECKED_IN: "bg-blue-500/20 text-blue-400",
  CHECKED_OUT: "bg-slate-500/20 text-slate-400",
};

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    const token = getCustomerToken();
    setBookingsLoading(true);
    setBookingsError(false);
    if (!token) {
      setBookings([]);
      setBookingsLoading(false);
      return;
    }
    getBookingHistory(token)
      .then((res) => {
        if (isApiError(res)) {
          setBookingsError(true);
          setBookings([]);
        } else {
          const raw = res.data;
          const list = Array.isArray(raw)
            ? raw
            : (raw && typeof raw === "object" && Array.isArray((raw as { bookings?: BookingHistoryItem[] }).bookings))
              ? (raw as { bookings: BookingHistoryItem[] }).bookings
              : [];
          setBookings(list);
        }
      })
      .catch(() => {
        setBookingsError(true);
        setBookings([]);
      })
      .finally(() => setBookingsLoading(false));
  }, [ready]);

  if (!ready) {
    return (
      <div className="min-h-screen app-shell flex items-center justify-center">
        <p className="text-slate-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-shell">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl font-light mb-2" style={{ color: "var(--foreground)" }}>
          Your Dashboard
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Manage your bookings and account settings
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/book"
            className="card p-6 block hover:border-[var(--accent)] transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg group-hover:scale-105 transition-transform" style={{ background: "var(--accent-soft)" }}>
                <svg className="w-5 h-5" fill="none" stroke="var(--accent)" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>Book a Room</span>
            </div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Check availability and complete your booking
            </p>
          </Link>
          <Link
            href="/my-booking"
            className="card p-6 block hover:border-[var(--accent)] transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg group-hover:scale-105 transition-transform" style={{ background: "var(--accent-soft)" }}>
                <svg className="w-5 h-5" fill="none" stroke="var(--accent)" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>View My Booking</span>
            </div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Look up your booking with reference and phone
            </p>
          </Link>
        </div>

        <section className="mt-10 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-heading text-xl font-light mb-2" style={{ color: "var(--foreground)" }}>
            Booking History
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            All bookings linked to your account email: {getCustomerEmail()}
          </p>
          {bookingsLoading ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>Loading your bookings…</p>
          ) : bookingsError || !Array.isArray(bookings) || bookings.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                {bookingsError
                  ? "We couldn’t load your booking history. Use View my booking to look up a booking by reference and phone."
                  : "No bookings yet. Book a room or look up an existing booking."}
              </p>
              <Link
                href="/my-booking"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                View my booking
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {(Array.isArray(bookings) ? bookings : []).map((b) => {
                const emailQ = getCustomerEmail();
                const href = emailQ
                  ? `/my-booking?ref=${encodeURIComponent(b.bookingReference)}&phone=${encodeURIComponent(b.guestPhone)}&email=${encodeURIComponent(emailQ)}`
                  : `/my-booking?ref=${encodeURIComponent(b.bookingReference)}&phone=${encodeURIComponent(b.guestPhone)}`;
                return (
                <li key={b.bookingId}>
                  <Link
                    href={href}
                    className="card p-4 block hover:border-[var(--accent)] transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-mono font-semibold text-[var(--accent)]">
                        {b.bookingReference}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          statusBadge[b.status] ?? "bg-slate-500/20 text-slate-400"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: "var(--foreground)" }}>
                      {b.isBatch && b.rooms ? (
                        <span>{b.rooms.length} Rooms - Multi-room Booking</span>
                      ) : (
                        <span>{b.roomNumber} · {b.roomType}</span>
                      )}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                      {formatDate(b.checkIn)} – {formatDate(b.checkOut)} ·{" "}
                      {formatCurrency(b.totalAmount)}
                    </p>
                  </Link>
                </li>
              );})}
            </ul>
          )}
        </section>

        <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
          <Link
            href="/logout"
            className="text-sm hover:text-[var(--accent)] transition-colors"
            style={{ color: "var(--muted)" }}
          >
            Log out →
          </Link>
        </div>
      </main>
    </div>
  );
}
