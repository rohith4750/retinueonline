"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BookLayout from "../components/BookLayout";
import { ROOM_TYPE_LABELS, type RoomType } from "@/lib/public-api";

const ROOM_TYPES: RoomType[] = [
  "SINGLE",
  "DOUBLE",
  "DELUXE",
  "STANDARD",
  "SUITE",
  "SUITE_PLUS",
];

export default function BookPage() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomType, setRoomType] = useState<RoomType | "">("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Check-out must be after check-in.");
      return;
    }
    const params = new URLSearchParams({
      checkIn,
      checkOut,
    });
    if (roomType) params.set("roomType", roomType);
    router.push(`/book/rooms?${params.toString()}`);
  }

  return (
    <BookLayout currentStep="/book">
      <div className="card p-6 max-w-md mx-auto">
        <h2 className="card-header text-xl font-semibold text-slate-100">
          Check availability
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Check-in</label>
            <input
              type="date"
              className="form-input"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">Check-out</label>
            <input
              type="date"
              className="form-input"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">Room type (optional)</label>
            <select
              className="form-select"
              value={roomType}
              onChange={(e) => setRoomType((e.target.value || "") as RoomType | "")}
            >
              <option value="">Any</option>
              {ROOM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {ROOM_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary w-full py-3">
            Check availability
          </button>
        </form>
      </div>
    </BookLayout>
  );
}
