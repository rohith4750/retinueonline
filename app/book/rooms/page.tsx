"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BookLayout from "../../components/BookLayout";
import { publicApi, isApiError, formatCurrency, formatDate, type ApiResponse, type AvailableRoomsData, type RoomAvailable } from "@/lib/public-api";
import styles from "./page.module.scss";

// Helper function to get room image based on type
function getRoomImage(roomType: string): string {
  const imageMap: Record<string, string> = {
    STANDARD: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    SUITE: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    SUITE_PLUS: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
  };
  return imageMap[roomType] || imageMap.STANDARD;
}

// Get badge class based on room type
function getBadgeClass(roomType: string): string {
  if (roomType === "STANDARD") return styles.standard;
  if (roomType === "SUITE_PLUS") return styles.suitePlus;
  return styles.suite;
}

// Get room name from room number
function getRoomName(roomType: string, roomNumber: string): string {
  if (roomType === "STANDARD") return "The Standard";
  if (roomType === "SUITE") return "The Suite";
  if (roomType === "SUITE_PLUS") return "The Suite Plus";
  return "The Suite";
}

export default function RoomsPage() {
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

  // Define category order and display names
  const categoryOrder = [
    { key: "STANDARD", label: "Standard Rooms", description: "Comfortable rooms perfect for couples or small families" },
    { key: "SUITE", label: "Suite Rooms", description: "Spacious suites ideal for longer stays or groups" },
    { key: "SUITE_PLUS", label: "Suite Plus Rooms", description: "Premium suites with extra space and luxury amenities" },
  ];

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
      // Remove room from selection
      setSelectedRooms(selectedRooms.filter(r => r.id !== room.id));
    } else {
      // Add room to selection
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  const isRoomSelected = (roomId: string) => {
    return selectedRooms.some(r => r.id === roomId);
  };

  const handleProceedToCheckout = () => {
    if (selectedRooms.length === 0) return;
    
    // Store selected rooms in sessionStorage
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
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Room Features */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.cardTitle}>Room Features</h3>
              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                      <polyline points="17 2 12 7 7 2"/>
                    </svg>
                  </div>
                  <span className={styles.featureName}>Smart TV</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                  </div>
                  <span className={styles.featureName}>Hot Water</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                      <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                      <circle cx="12" cy="20" r="1"/>
                    </svg>
                  </div>
                  <span className={styles.featureName}>High-Speed Internet</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"/>
                      <path d="M9 2V22"/>
                    </svg>
                  </div>
                  <span className={styles.featureName}>Bath Tub</span>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.cardTitle}>Experience</h3>
              <div className={styles.experienceList}>
                <div className={styles.experienceItem}>
                  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Our staff is available 24/7 to assist with any needs</span>
                </div>
                <div className={styles.experienceItem}>
                  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Breakfast is included in all room packages</span>
                </div>
                <div className={styles.experienceItem}>
                  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Open access to all common areas and facilities</span>
                </div>
              </div>
            </div>

            {/* Convention Hall Promo */}
            <div className={styles.promoCard}>
              <h3 className={styles.promoTitle}>Convention Hall Excellence</h3>
              <p className={styles.promoText}>
                Host your special events at Buchiraju Conventions with world-class facilities
              </p>
              <Link href="/conventions" className={styles.promoLink}>
                Book Your Event
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className={styles.mainContent}>
            <div className={styles.contentHeader}>
              <div className={styles.headerTop}>
                <h1 className={styles.pageTitle}>Available Rooms</h1>
              </div>
              {checkIn && checkOut && (
                <div className={styles.dateInfo}>
                  <span>
                    {formatDate(checkIn)} - {formatDate(checkOut)}
                  </span>
                  <Link href="/book" className={styles.changeDates}>
                    Change dates
                  </Link>
                </div>
              )}
              <p className={styles.subtitle}>
                Manage your upcoming retreats and revisit past memories
              </p>
            </div>

            {loading ? (
              <div className={styles.loadingContainer}>
                <p className={styles.loadingText}>Loading available rooms...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className={styles.emptyState}>
                <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <h2 className={styles.emptyTitle}>No rooms available</h2>
                <p className={styles.emptyText}>
                  Unfortunately, no rooms are available for the selected dates. Please try different dates.
                </p>
                <Link href="/book" className={styles.emptyButton}>
                  Choose Different Dates
                </Link>
              </div>
            ) : (
              <div className={styles.categoriesContainer}>
                {categoryOrder.map((category) => {
                  const categoryRooms = groupedRooms[category.key] || [];
                  
                  if (categoryRooms.length === 0) return null;

                  return (
                    <div key={category.key} className={styles.categorySection}>
                      <div className={styles.categoryHeader}>
                        <h2 className={styles.categoryTitle}>{category.label}</h2>
                        <p className={styles.categoryDescription}>{category.description}</p>
                      </div>

                      <div className={styles.roomsGrid}>
                        {categoryRooms.map((room) => (
                          <article key={room.roomNumber} className={styles.roomCard}>
                            <div className={styles.roomImageWrapper}>
                              <div className={styles.roomImage}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={getRoomImage(room.roomType)}
                                  alt={`${room.roomType} room ${room.roomNumber}`}
                                />
                              </div>
                              <span className={`${styles.roomBadge} ${getBadgeClass(room.roomType)}`}>
                                {room.roomType === "SUITE_PLUS" ? "SUITE PLUS" : room.roomType.replace("_", " ")}
                              </span>
                            </div>

                            <div className={styles.roomContent}>
                              <div className={styles.roomHeader}>
                                <h3 className={styles.roomName}>
                                  {getRoomName(room.roomType, room.roomNumber)}
                                </h3>
                                <p className={styles.roomNumber}>
                                  Room {room.roomNumber} · King Bed
                                </p>
                              </div>

                              <div className={styles.roomPrice}>
                                <span className={styles.price}>{formatCurrency(room.basePrice)}</span>
                                <span className={styles.period}>/ night</span>
                              </div>

                              <div className={styles.roomRating}>
                                <div className={styles.stars}>
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i}>★</span>
                                  ))}
                                </div>
                                <span className={styles.ratingScore}>4.8</span>
                                <span className={styles.reviewCount}>(142 reviews)</span>
                              </div>

                              <div className={styles.roomFeatures}>
                                <div className={styles.feature}>
                                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                                    <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
                                  </svg>
                                  <span>King Bed</span>
                                </div>
                                <div className={styles.feature}>
                                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" strokeWidth="2">
                                    <path d="M12 2v20M2 12h20"/>
                                    <circle cx="12" cy="12" r="3"/>
                                  </svg>
                                  <span>Climate Control</span>
                                </div>
                                <div className={styles.feature}>
                                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" strokeWidth="2">
                                    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                                    <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                                  </svg>
                                  <span>High-speed Wi-Fi</span>
                                </div>
                              </div>

                              <div className={styles.roomInfo}>
                                <div className={styles.info}>
                                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                  </svg>
                                  <span>{room.capacity || 2} Guests</span>
                                </div>
                                <div className={styles.info}>
                                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                  </svg>
                                  <span>Floor {room.floor || 1}</span>
                                </div>
                              </div>

                              <button
                                onClick={() => handleAddRoom(room)}
                                className={`${styles.selectButton} ${isRoomSelected(room.id) ? styles.selected : ''}`}
                                disabled={room.status !== "AVAILABLE"}
                              >
                                {room.status !== "AVAILABLE" 
                                  ? "Not Available" 
                                  : isRoomSelected(room.id) 
                                    ? "✓ Selected" 
                                    : "Select Room"
                                }
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>

        {/* Floating Cart Button */}
        {selectedRooms.length > 0 && (
          <div className={styles.floatingCart}>
            <div className={styles.cartContent}>
              <div className={styles.cartInfo}>
                <span className={styles.cartCount}>{selectedRooms.length} Room{selectedRooms.length > 1 ? 's' : ''} Selected</span>
                <span className={styles.cartTotal}>{formatCurrency(getTotalPrice())} per night</span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className={styles.checkoutButton}
              >
                Proceed to Checkout
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </BookLayout>
  );
}
