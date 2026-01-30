"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BookLayout from "../../components/BookLayout";
import {
  publicApi,
  isApiError,
  ROOM_TYPE_LABELS,
  formatCurrency,
  type CreateBookingBody,
} from "@/lib/public-api";

const CONFIRM_KEY = "booking_confirmation";

function CheckoutFallback() {
  return (
    <BookLayout currentStep="/book/checkout">
      <div className="card p-8 text-center text-slate-400">Loading…</div>
    </BookLayout>
  );
}

function BookCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const roomId = searchParams.get("roomId") ?? "";
  const roomNumber = searchParams.get("roomNumber") ?? "";
  const roomType = searchParams.get("roomType") ?? "";
  const basePrice = searchParams.get("basePrice") ?? "0";

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestAddress, setGuestAddress] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const invalid =
    !roomId ||
    !checkIn ||
    !checkOut ||
    !guestName.trim() ||
    !guestPhone.trim() ||
    !agreeTerms;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const phone = guestPhone.replace(/\D/g, "");
    if (phone.length !== 10) {
      setError("Phone must be 10 digits (Indian mobile).");
      return;
    }
    setLoading(true);
    const body: CreateBookingBody = {
      roomId,
      guestName: guestName.trim(),
      guestPhone: phone,
      checkIn,
      checkOut,
      numberOfGuests: numberOfGuests || 1,
    };
    if (guestAddress.trim()) body.guestAddress = guestAddress.trim();

    publicApi<{
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
    }>("/bookings", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (isApiError(res)) {
          setError(res.message || res.error);
          setLoading(false);
          return;
        }
        const data = res.data;
        try {
          sessionStorage.setItem(
            CONFIRM_KEY,
            JSON.stringify({
              bookingReference: data.bookingReference,
              bookingId: data.bookingId,
              guestName: data.guestName,
              guestPhone: data.guestPhone,
              checkIn: data.checkIn,
              checkOut: data.checkOut,
              roomNumber: data.roomNumber,
              roomType: data.roomType,
              totalAmount: data.totalAmount,
              status: data.status,
            })
          );
        } catch (_) {}
        router.push("/book/confirmation");
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      });
  }

  if (!roomId || !checkIn || !checkOut) {
    return (
      <BookLayout currentStep="/book/checkout">
        <div className="card p-6 max-w-md mx-auto">
          <p className="text-slate-400 mb-4">
            Missing booking details. Please select a room from availability.
          </p>
          <Link href="/book" className="btn-secondary">
            Start over
          </Link>
        </div>
      </BookLayout>
    );
  }

  return (
    <BookLayout currentStep="/book/checkout">
      <div className="card p-6 max-w-lg mx-auto">
        <div className="card-header mb-4">
          <h2 className="text-xl font-semibold text-slate-100">
            Guest details
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Room {roomNumber} · {(ROOM_TYPE_LABELS as Record<string, string>)[roomType] ?? roomType} · {formatCurrency(Number(basePrice))}/night
          </p>
          <p className="text-slate-400 text-sm">
            {new Date(checkIn).toLocaleDateString("en-IN")} –{" "}
            {new Date(checkOut).toLocaleDateString("en-IN")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Full name *</label>
            <input
              type="text"
              className="form-input"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Guest name"
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
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
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
              value={guestAddress}
              onChange={(e) => setGuestAddress(e.target.value)}
              placeholder="Address"
            />
          </div>
          <div>
            <label className="form-label">Number of guests</label>
            <input
              type="number"
              className="form-input"
              min={1}
              max={10}
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(Number(e.target.value) || 1)}
            />
          </div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-500"
            />
            <span className="text-sm text-slate-400">
              I agree to the booking terms and cancellation policy.
            </span>
          </label>
          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <Link
              href={`/book/rooms?checkIn=${checkIn}&checkOut=${checkOut}`}
              className="btn-secondary flex-1 text-center"
            >
              Back
            </Link>
            <button
              type="submit"
              disabled={invalid || loading}
              className="btn-primary flex-1 py-3"
            >
              {loading ? "Confirming…" : "Confirm booking"}
            </button>
          </div>
        </form>
      </div>
    </BookLayout>
  );
}

export default function BookCheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <BookCheckoutContent />
    </Suspense>
  );
}
