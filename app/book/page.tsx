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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [error, setError] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert to Monday = 0

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!checkInDate || !checkOutDate) return false;
    return date >= checkInDate && date <= checkOutDate;
  };

  const isDateSelected = (date: Date) => {
    if (!checkInDate) return false;
    if (!checkOutDate) return date.getTime() === checkInDate.getTime();
    return date.getTime() === checkInDate.getTime() || date.getTime() === checkOutDate.getTime();
  };

  const handleDateClick = (date: Date) => {
    if (date < today) return;

    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(date);
      setCheckOutDate(null);
    } else if (date > checkInDate) {
      setCheckOutDate(date);
    } else {
      setCheckInDate(date);
      setCheckOutDate(null);
    }
  };

  const getNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getTotalGuests = () => adults + children + infants;

  const handleSubmit = () => {
    setError("");
    if (!checkInDate || !checkOutDate) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    const params = new URLSearchParams({
      checkIn: checkInDate.toISOString().slice(0, 10),
      checkOut: checkOutDate.toISOString().slice(0, 10),
    });
    router.push(`/book/rooms?${params.toString()}`);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <BookLayout currentStep="/book">
      <div className="card p-5 sm:p-6 max-w-3xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-light mb-1 text-center" style={{ color: "var(--foreground)", fontFamily: "var(--font-serif)" }}>
          Your Haven Awaits
        </h2>
        <p className="text-xs mb-6 text-center" style={{ color: "var(--muted)" }}>
          Select your preferred dates for booking
        </p>

        <div className="grid lg:grid-cols-[1.5fr,1fr] gap-6">
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map(day => (
                <div key={day} className="text-center text-[10px] font-medium py-1" style={{ color: "var(--muted)" }}>
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((date, idx) => {
                if (!date) {
                  return <div key={`empty-${idx}`} />;
                }
                const isDisabled = date < today;
                const isSelected = isDateSelected(date);
                const inRange = isDateInRange(date);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => handleDateClick(date)}
                    disabled={isDisabled}
                    className={`
                      aspect-square rounded-full flex items-center justify-center text-xs transition-all
                      ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-orange-50 cursor-pointer'}
                      ${isSelected ? 'bg-[var(--accent)] text-white font-bold' : ''}
                      ${inRange && !isSelected ? 'bg-orange-100' : ''}
                    `}
                    style={{ color: isSelected ? 'white' : 'var(--foreground)' }}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guests */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span className="font-medium text-sm" style={{ color: "var(--foreground)" }}>Guests</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-xs" style={{ color: "var(--foreground)" }}>Adults</div>
                    <div className="text-[10px]" style={{ color: "var(--muted)" }}>Ages 13+</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors text-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-medium text-sm">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors text-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-xs" style={{ color: "var(--foreground)" }}>Children</div>
                    <div className="text-[10px]" style={{ color: "var(--muted)" }}>Ages 2-12</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors text-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-medium text-sm">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors text-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-xs" style={{ color: "var(--foreground)" }}>Infants</div>
                    <div className="text-[10px]" style={{ color: "var(--muted)" }}>Under 2</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors text-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-medium text-sm">{infants}</span>
                    <button
                      type="button"
                      onClick={() => setInfants(infants + 1)}
                      className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors text-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "var(--muted)" }}>Stay Duration</div>
                  <div className="font-bold text-base">{getNights()} Nights</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "var(--muted)" }}>Total Guests</div>
                  <div className="font-bold text-base">{getTotalGuests()} Guests</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 mt-4 text-center" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          className="btn-primary w-full py-3 text-sm mt-6 flex items-center justify-center gap-2"
        >
          Check Availability
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        {/* Bottom Icons */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Secure Booking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Flexible Dates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Luxury Service</span>
          </div>
        </div>
      </div>
    </BookLayout>
  );
}
