"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BookLayout from "../../components/BookLayout";
import {
  publicApi,
  isApiError,
  ROOM_TYPE_LABELS,
  formatCurrency,
  type RoomAvailable,
  type RoomType,
} from "@/lib/public-api";

export default function BookRoomsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const roomTypeParam = searchParams.get("roomType") ?? "";

  const [rooms, setRooms] = useState<RoomAvailable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState<{
    checkIn: string;
    checkOut: string;
  } | null>(null);

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setError("Missing dates. Please start from the booking page.");
      setLoading(false);
      return;
    }
    const params = new URLSearchParams({ checkIn, checkOut });
    if (roomTypeParam) params.set("roomType", roomTypeParam);
    publicApi<{
      rooms: RoomAvailable[];
      dateRange: { checkIn: string; checkOut: string } | null;
      availableRoomCount: number;
    }>(`/rooms/available?${params.toString()}`)
      .then((res) => {
        if (isApiError(res)) {
          setError(res.message || res.error);
          return;
        }
        setRooms(res.data.rooms.filter((r) => r.status === "AVAILABLE"));
        setDateRange(res.data.dateRange ?? null);
      })
      .catch(() => setError("Unable to load availability."))
      .finally(() => setLoading(false));
  }, [checkIn, checkOut, roomTypeParam]);

  function selectRoom(room: RoomAvailable) {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      basePrice: String(room.basePrice),
    });
    router.push(`/book/checkout?${params.toString()}`);
  }

  if (loading) {
    return (
      <BookLayout currentStep="/book/rooms">
        <div className="card p-8 text-center text-slate-400">
          Loading availability…
        </div>
      </BookLayout>
    );
  }

  if (error) {
    return (
      <BookLayout currentStep="/book/rooms">
        <div className="card p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/book" className="btn-secondary">
            Back to dates
          </Link>
        </div>
      </BookLayout>
    );
  }

  return (
    <BookLayout currentStep="/book/rooms">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <p className="text-slate-400 text-sm">
          {dateRange
            ? `${new Date(dateRange.checkIn).toLocaleDateString("en-IN")} – ${new Date(dateRange.checkOut).toLocaleDateString("en-IN")}`
            : "Selected dates"}
          {roomTypeParam && (
            <span className="ml-2">
              · {ROOM_TYPE_LABELS[roomTypeParam as RoomType]}
            </span>
          )}
        </p>
        <Link
          href={`/book?checkIn=${checkIn}&checkOut=${checkOut}`}
          className="text-sm text-sky-400 hover:underline"
        >
          Change dates
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="card p-8 text-center text-slate-400">
          No rooms available for these dates. Try different dates or room type.
          <div className="mt-4">
            <Link href="/book" className="btn-secondary">
              Change dates
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="card p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lg font-semibold text-slate-100">
                    Room {room.roomNumber}
                  </span>
                  <span className="badge badge-info">
                    {ROOM_TYPE_LABELS[room.roomType as RoomType]}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-2">
                  Up to {room.capacity} guests · Floor {room.floor}
                </p>
                <p className="text-xl font-semibold text-sky-400">
                  {formatCurrency(room.basePrice)}
                  <span className="text-sm font-normal text-slate-400">
                    /night
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectRoom(room)}
                className="btn-primary w-full mt-4 py-2.5"
              >
                Select room
              </button>
            </div>
          ))}
        </div>
      )}
    </BookLayout>
  );
}
