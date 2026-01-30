"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookLayout from "../../components/BookLayout";
import { formatDate, formatCurrency } from "@/lib/public-api";

const CONFIRM_KEY = "booking_confirmation";

type Stored = {
  bookingReference: string;
  bookingId: string;
  guestName: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  roomNumber: string;
  roomType: string;
  totalAmount: number;
  status: string;
};

export default function BookConfirmationPage() {
  const [data, setData] = useState<Stored | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CONFIRM_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Stored;
        setData(parsed);
        sessionStorage.removeItem(CONFIRM_KEY);
      }
    } catch (_) {}
  }, []);

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
      <div className="card p-6 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mb-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-100">
            Booking confirmed
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Save your booking reference to view or manage your booking.
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Booking reference
          </p>
          <p className="text-2xl font-mono font-bold text-sky-400 tracking-wider">
            {data.bookingReference}
          </p>
          {data.bookingId && (
            <p className="text-slate-500 text-sm mt-1">ID: {data.bookingId}</p>
          )}
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-400">Guest</dt>
            <dd className="text-slate-100">{data.guestName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Phone</dt>
            <dd className="text-slate-100">{data.guestPhone}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Check-in</dt>
            <dd className="text-slate-100">{formatDate(data.checkIn)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Check-out</dt>
            <dd className="text-slate-100">{formatDate(data.checkOut)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Room</dt>
            <dd className="text-slate-100">
              {data.roomNumber} · {data.roomType}
            </dd>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/5">
            <dt className="text-slate-400">Total</dt>
            <dd className="text-slate-100 font-semibold">
              {formatCurrency(data.totalAmount)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 pt-4 border-t border-white/5">
          <Link
            href="/my-booking"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            View my booking
          </Link>
          <p className="text-slate-500 text-xs text-center mt-3">
            Enter your booking reference and phone on the next page.
          </p>
        </div>
      </div>
    </BookLayout>
  );
}
