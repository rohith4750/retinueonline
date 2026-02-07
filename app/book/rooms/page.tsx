"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BookLayout from "../../components/BookLayout";
import { publicApi, isApiError, formatCurrency, formatDate, type ApiResponse, type AvailableRoomsData, type RoomAvailable } from "@/lib/public-api";
import styles from "./page.module.scss";

// Static details for each room type to match the design
const ROOM_DETAILS: Record<string, {
  label: string;
  image: string;
  amenities: string[];
  rating: number;
  reviews: number;
}> = {
  STANDARD: {
    label: "The Standard",
    image: "/images/rooms/WhatsApp Image 2026-02-06 at 6.36.48 PM.jpeg",
    amenities: ["King Bed", "Climate Control", "High-speed Wi-Fi"],
    rating: 4.8,
    reviews: 142
  },
  SUITE: {
    label: "The Suite",
    image: "/images/rooms/suite-room.jpeg",
    amenities: ["King Bed", "Climate Control", "High-speed Wi-Fi", "Living Area"],
    rating: 4.9,
    reviews: 86
  },
  SUITE_PLUS: {
    label: "The Suite Plus",
    image: "/images/rooms/suite-plus.jpeg",
    amenities: ["King Bed", "Climate Control", "High-speed Wi-Fi", "Living Area", "Bathtub"],
    rating: 5.0,
    reviews: 42
  }
};

function getRoomDetail(roomType: string) {
  return ROOM_DETAILS[roomType] || ROOM_DETAILS.STANDARD;
}

function RoomsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState<RoomAvailable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState<RoomAvailable[]>([]);

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  // Group rooms by category
  const groupedRooms = rooms.reduce((acc, room) => {
    const type = room.roomType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(room);
    return acc;
  }, {} as Record<string, RoomAvailable[]>);

  // Define category order
  const categoryOrder = ["STANDARD", "SUITE", "SUITE_PLUS"];

  useEffect(() => {
    if (!checkIn || !checkOut) {
      router.replace("/book");
      return;
    }

    setLoading(true);
    publicApi<AvailableRoomsData>(`/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`)
      .then((res: ApiResponse<AvailableRoomsData>) => {
        if (isApiError(res)) {
          setRooms([]);
        } else {
          setRooms(res.data.rooms || []);
        }
      })
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, [checkIn, checkOut, router]);

  const handleAddRoom = (room: RoomAvailable) => {
    const isAlreadySelected = selectedRooms.some(r => r.id === room.id);

    if (isAlreadySelected) {
      setSelectedRooms(selectedRooms.filter(r => r.id !== room.id));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  const isRoomSelected = (roomId: string) => {
    return selectedRooms.some(r => r.id === roomId);
  };

  const handleProceedToCheckout = () => {
    if (selectedRooms.length === 0) return;

    sessionStorage.setItem('selectedRooms', JSON.stringify({
      rooms: selectedRooms,
      checkIn,
      checkOut
    }));

    router.push(`/book/checkout?checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  const getTotalPrice = () => {
    return selectedRooms.reduce((sum, room) => sum + room.basePrice, 0);
  };

  return (
    <BookLayout currentStep="/book/rooms">
      <div className={styles.container}>
        <div className={styles.pageLayout}>
          {/* Main Content */}
          <main className={styles.mainContent}>
            <div className={styles.contentHeader}>
              <h1 className={styles.pageTitle}>Available Rooms</h1>
              <p className={styles.subtitle}>
                Manage your upcoming retreats and revisit past memories.
              </p>
            </div>

            {loading ? (
              <div className={styles.loadingContainer}>Loading available rooms...</div>
            ) : rooms.length === 0 ? (
              <div className={styles.emptyState}>
                <h2>No rooms available</h2>
                <p>Please try different dates.</p>
                <Link href="/book" className={styles.emptyButton}>Change Dates</Link>
              </div>
            ) : (
              <div className={styles.roomsList}>
                {categoryOrder.map((catKey) => {
                  const categoryRooms = groupedRooms[catKey] || [];
                  if (categoryRooms.length === 0) return null;
                  const details = getRoomDetail(catKey);

                  return categoryRooms.map((room) => (
                    <article key={room.id} className={styles.roomCard}>
                      <div className={styles.roomImageWrapper}>
                        <span className={styles.roomBadge}>{details.label}</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={details.image} alt={details.label} />
                      </div>

                      <div className={styles.roomContent}>
                        <div className={styles.roomHeader}>
                          <div>
                            <h2 className={styles.roomName}>{details.label}</h2>
                            <div className={styles.amenitiesList}>
                              {details.amenities.map(a => (
                                <span key={a} className={styles.amenityItem}>• {a}</span>
                              ))}
                            </div>
                          </div>
                          <div className={styles.roomPriceBlock}>
                            <div className={styles.price}>{formatCurrency(room.basePrice)}</div>
                            <div className={styles.period}>/ night</div>
                            <div className={styles.capacity}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                              {room.capacity} Guests
                            </div>
                          </div>
                        </div>

                        <div className={styles.roomFooter}>
                          <div className={styles.roomRating}>
                            <span className={styles.star}>★</span>
                            <span className={styles.score}>{details.rating}</span>
                            <span className={styles.reviews}>({details.reviews} reviews)</span>
                          </div>

                          <button
                            onClick={() => handleAddRoom(room)}
                            className={`${styles.selectButton} ${isRoomSelected(room.id) ? styles.selected : ''}`}
                            disabled={room.status !== "AVAILABLE"}
                          >
                            {isRoomSelected(room.id) ? "Selected" : "Select Room"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ));
                })}
              </div>
            )}
          </main>

          {/* Info Section (Formerly Sidebar) */}
          <aside className={styles.sidebar}>
            {/* Room Features */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>ROOM FEATURES</h3>
              <ul className={styles.checkList}>
                <li>
                  <span className={styles.checkIcon}>✔</span>
                  Smart TV
                </li>
                <li>
                  <span className={styles.checkIcon}>✔</span>
                  Hot Water
                </li>
                <li>
                  <span className={styles.checkIcon}>✔</span>
                  High-Speed Internet
                </li>
                <li className={styles.unchecked}>
                  <span className={styles.checkBox} />
                  Bath Tub
                </li>
              </ul>
            </div>

            {/* Experience */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>EXPERIENCE</h3>
              <ul className={styles.checkList}>
                <li className={styles.unchecked}>
                  <span className={styles.checkBox} />
                  Gym Access
                </li>
              </ul>
            </div>

            {/* Convention Promo */}
            <div className={styles.promoCard}>
              <div className={styles.promoTag}>CONVENTION EXCELLENCE</div>
              <h3>Host Your Next Event...</h3>
              <p>Whether you're planning a grand wedding or a focused corporate seminar...</p>
              <div className={styles.promoLinks}>
                <small>• Corporate Meetings</small>
                <small>• Grand Weddings</small>
              </div>
              <div className={styles.promoImages}>
                <div className={styles.promoImg} style={{ backgroundImage: "url('/images/conventions/WhatsApp Image 2026-02-06 at 6.37.19 PM.jpeg')" }} />
                <div className={styles.promoImg} style={{ backgroundImage: "url('/images/conventions/WhatsApp Image 2026-02-06 at 6.37.20 PM.jpeg')" }} />
                <div className={styles.promoImg} style={{ backgroundImage: "url('/images/conventions/WhatsApp Image 2026-02-06 at 6.37.18 PM.jpeg')" }} />
              </div>
              <Link href="/conventions" className={styles.promoButton}>
                Book Your Event
              </Link>
            </div>
          </aside>
        </div>

        {selectedRooms.length > 0 && (
          <div className={styles.floatingCart}>
            <div className={styles.cartContent}>
              <span>{selectedRooms.length} Room(s) Selected</span>
              <div className="flex items-center gap-4">
                <span className="font-bold">{formatCurrency(getTotalPrice())}</span>
                <button onClick={handleProceedToCheckout} className={styles.checkoutButton}>
                  Proceed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BookLayout>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <RoomsPageContent />
    </Suspense>
  );
}
