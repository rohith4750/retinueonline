"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookLayout from "../../components/BookLayout";
import { formatDate, formatCurrency } from "@/lib/public-api";

const CONFIRM_KEY = "booking_confirmation";

type Stored = {
  bookingReference: string;
  bookingId?: string;
  guestName: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  roomNumber?: string;
  roomType?: string;
  totalAmount: number;
  status: string;
  rooms?: Array<{
    roomId: string;
    roomNumber: string;
    roomType: string;
    basePrice: number;
  }>;
  isBatch?: boolean;
};

export default function BookConfirmationPage() {
  const [data, setData] = useState<Stored | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CONFIRM_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Stored;
        setData(parsed);
      }
    } catch (_) {}
    setHasChecked(true);
  }, []);

  if (!hasChecked) {
    return (
      <BookLayout currentStep="/book/confirmation">
        <div className="card p-8 max-w-md mx-auto text-center text-slate-400">
          Loading…
        </div>
      </BookLayout>
    );
  }

  if (data === null) {
    return (
      <BookLayout currentStep="/book/confirmation">
        <div className="card p-8 max-w-md mx-auto text-center">
          <p className="text-slate-400 mb-4">
            No booking confirmation in this session. Use &quot;View my
            booking&quot; with your booking reference and phone to see your
            booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/my-booking" className="btn-primary">
              View my booking
            </Link>
            <Link href="/book" className="btn-secondary">
              Book a room
            </Link>
          </div>
        </div>
      </BookLayout>
    );
  }

  return (
    <BookLayout currentStep="/book/confirmation">
      <div className="card p-6 sm:p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: "var(--accent-soft)" }}>
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="var(--accent)"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-light mb-2" style={{ color: "var(--foreground)", fontFamily: "var(--font-serif)" }}>
            Booking Confirmed!
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Your reservation has been successfully confirmed. Save your booking reference below.
          </p>
        </div>

        <div className="rounded-2xl p-6 mb-6 text-center" style={{ background: "var(--accent-soft)", borderLeft: "4px solid var(--accent)" }}>
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
            Booking Reference
          </p>
          <p className="text-3xl font-mono font-bold tracking-wider" style={{ color: "var(--accent)" }}>
            {data.bookingReference}
          </p>
          {data.bookingId && (
            <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>Booking ID: {data.bookingId}</p>
          )}
        </div>

        <div className="card p-6 mb-6">
          <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--accent)" }}>
            Booking Details
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt style={{ color: "var(--muted)" }}>Guest Name</dt>
              <dd className="font-medium" style={{ color: "var(--foreground)" }}>{data.guestName}</dd>
            </div>
            <div className="flex justify-between">
              <dt style={{ color: "var(--muted)" }}>Phone Number</dt>
              <dd className="font-medium" style={{ color: "var(--foreground)" }}>{data.guestPhone}</dd>
            </div>
            <div className="flex justify-between">
              <dt style={{ color: "var(--muted)" }}>Check-in</dt>
              <dd className="font-medium" style={{ color: "var(--foreground)" }}>{formatDate(data.checkIn)}</dd>
            </div>
            <div className="flex justify-between">
              <dt style={{ color: "var(--muted)" }}>Check-out</dt>
              <dd className="font-medium" style={{ color: "var(--foreground)" }}>{formatDate(data.checkOut)}</dd>
            </div>
            <div className="flex justify-between">
              <dt style={{ color: "var(--muted)" }}>
                {data.isBatch && data.rooms ? "Rooms" : "Room"}
              </dt>
              <dd className="font-medium" style={{ color: "var(--foreground)" }}>
                {data.isBatch && data.rooms ? (
                  <div className="space-y-1 text-right">
                    {data.rooms.map((room, idx) => (
                      <div key={room.roomId}>
                        {room.roomNumber} · {room.roomType.replace('_', ' ')}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span>{data.roomNumber} · {data.roomType}</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
              <dt className="font-semibold" style={{ color: "var(--foreground)" }}>Total Amount</dt>
              <dd className="font-bold text-lg" style={{ color: "var(--accent)" }}>
                {formatCurrency(data.totalAmount)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt style={{ color: "var(--muted)" }}>Status</dt>
              <dd>
                <span className="badge badge-success text-xs">{data.status}</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-3">
          <Link
            href="/my-booking"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            onClick={() => {
              try {
                sessionStorage.removeItem(CONFIRM_KEY);
              } catch (_) {}
            }}
          >
            View My Booking
          </Link>
          <Link
            href="/"
            className="btn-secondary w-full py-3 flex items-center justify-center"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--muted)" }}>
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </BookLayout>
  );
}
