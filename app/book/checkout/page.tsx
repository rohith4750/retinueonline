"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BookLayout from "../../components/BookLayout";
import {
  publicApi,
  isApiError,
  ROOM_TYPE_LABELS,
  formatCurrency,
  formatDate,
  type CreateBookingBody,
} from "@/lib/public-api";
import styles from "./page.module.scss";

const CONFIRM_KEY = "booking_confirmation";

// Helper function to get room image
function getRoomImage(roomType: string): string {
  const imageMap: Record<string, string> = {
    STANDARD: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    SUITE: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    SUITE_PLUS: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
  };
  return imageMap[roomType] || imageMap.STANDARD;
}

function CheckoutFallback() {
  return (
    <BookLayout currentStep="/book/checkout">
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Loading checkout...</p>
      </div>
    </BookLayout>
  );
}

function BookCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  
  // Get selected rooms from sessionStorage
  const [selectedRoomsData, setSelectedRoomsData] = useState<{
    rooms: any[];
    checkIn: string;
    checkOut: string;
  } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('selectedRooms');
    if (stored) {
      setSelectedRoomsData(JSON.parse(stored));
    }
  }, []);

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  // Payment details - commented out until payment gateway is integrated
  // const [cardholderName, setCardholderName] = useState("");
  // const [cardNumber, setCardNumber] = useState("");
  // const [expiryDate, setExpiryDate] = useState("");
  // const [cvv, setCvv] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const invalid =
    !selectedRoomsData ||
    selectedRoomsData.rooms.length === 0 ||
    !checkIn ||
    !checkOut ||
    !guestName.trim() ||
    !guestPhone.trim() ||
    !agreeTerms;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    if (!selectedRoomsData || selectedRoomsData.rooms.length === 0) {
      setError("No rooms selected. Please select rooms first.");
      return;
    }

    const phone = guestPhone.replace(/\D/g, "");
    if (phone.length !== 10) {
      setError("Phone must be 10 digits (Indian mobile).");
      return;
    }
    
    setLoading(true);

    try {
      // Use batch booking endpoint for multi-room bookings
      const roomIds = selectedRoomsData.rooms.map(r => r.id);
      
      const body = {
        roomIds: roomIds,
        guestName: guestName.trim(),
        guestPhone: phone,
        checkIn: selectedRoomsData.checkIn,
        checkOut: selectedRoomsData.checkOut,
        numberOfGuests: numberOfGuests || 1,
        guestAddress: specialRequests.trim() || undefined,
        discount: 0,
        advanceAmount: 0,
      };

      const res = await publicApi<{
        bookingReference: string;
        rooms: Array<{
          roomId: string;
          roomNumber: string;
          roomType: string;
          basePrice: number;
        }>;
        totalAmount: number;
        isBatch: boolean;
        guestName: string;
        guestPhone: string;
        checkIn: string;
        checkOut: string;
        status: string;
      }>("/bookings/batch", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (isApiError(res)) {
        setError(res.message || res.error || "Booking failed. Please try again.");
        setLoading(false);
        return;
      }

      // Store booking data for confirmation page
      const bookingData = res.data;
      try {
        sessionStorage.setItem(
          CONFIRM_KEY,
          JSON.stringify({
            bookingReference: bookingData.bookingReference,
            guestName: bookingData.guestName,
            guestPhone: bookingData.guestPhone,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            totalAmount: bookingData.totalAmount,
            status: bookingData.status,
            rooms: bookingData.rooms,
            isBatch: bookingData.isBatch,
          })
        );
        // Clear selected rooms
        sessionStorage.removeItem('selectedRooms');
      } catch (_) {}
      
      router.push("/book/confirmation");
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!selectedRoomsData || selectedRoomsData.rooms.length === 0 || !checkIn || !checkOut) {
    return (
      <BookLayout currentStep="/book/checkout">
        <div className={styles.container}>
          <div className={styles.errorMessage}>
            <p>Missing booking details. Please select rooms from availability.</p>
            <Link href="/book" className={styles.primaryButton} style={{ marginTop: '1rem', display: 'inline-block' }}>
              Start over
            </Link>
          </div>
        </div>
      </BookLayout>
    );
  }

  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  // Calculate total for all selected rooms
  const subtotal = selectedRoomsData 
    ? selectedRoomsData.rooms.reduce((sum, room) => sum + room.basePrice, 0) * nights
    : 0;
  const total = subtotal;

  return (
    <BookLayout currentStep="/book/checkout">
      <div className={styles.checkoutPage}>
        <div className={styles.container}>
          <div className={styles.checkoutLayout}>
            {/* Left Column - Guest Details Form */}
            <div className={styles.guestDetailsSection}>
              <div className={styles.sectionHeader}>
                <h1 className={styles.pageTitle}>Guest Details</h1>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Guest Information Card */}
                <div className={styles.formCard}>
                  <h2 className={styles.cardTitle}>
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Guest Information
                  </h2>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Full Name</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Email Address</label>
                      <input
                        type="email"
                        className={styles.input}
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label className={styles.label}>Phone Number</label>
                      <input
                        type="tel"
                        className={styles.input}
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+1(555) 000-0000"
                        required
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label className={styles.label}>Special Requests</label>
                      <textarea
                        className={styles.textarea}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Early check-in, dietary needs..."
                      />
                    </div>
                  </div>

                  <div className={styles.termsCheckbox}>
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <label htmlFor="terms" className={styles.termsText}>
                      I agree to Retinue's{" "}
                      <a href="/terms">Terms of Service</a> and{" "}
                      <a href="/privacy">Privacy Policy</a>. I understand the cancellation policy for this booking.
                    </label>
                  </div>
                </div>

                {/* Payment Information Notice */}
                <div className={styles.formCard}>
                  <div style={{ padding: "1rem", background: "var(--accent-soft)", borderRadius: "0.5rem", border: "1px solid var(--accent)" }}>
                    <p style={{ fontSize: "0.875rem", color: "var(--foreground)", margin: 0, lineHeight: 1.6 }}>
                      <strong>Payment Information:</strong> Payment will be collected at the hotel during check-in. 
                      We accept cash, cards, and UPI payments. Your booking is confirmed upon submission.
                    </p>
                  </div>
                </div>

                {/* Payment Details Card - Commented out until payment gateway is integrated */}
                {/* 
                <div className={styles.formCard}>
                  <h2 className={styles.cardTitle}>
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Payment Details
                  </h2>

                  <div className={styles.formGrid}>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label className={styles.label}>Cardholder Name</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label className={styles.label}>Card Number</label>
                      <div className={styles.inputWithIcon}>
                        <input
                          type="text"
                          className={styles.input}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                        />
                        <div className={styles.inputIcon}>
                          <svg viewBox="0 0 48 32" fill="none">
                            <rect width="48" height="32" rx="4" fill="#1A1F36"/>
                            <rect x="8" y="12" width="32" height="4" rx="2" fill="#FFB84D"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Expiry Date</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>CVV</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
                */}

                {error && (
                  <div className={styles.errorMessage}>{error}</div>
                )}
              </form>
            </div>

            {/* Right Column - Booking Summary */}
            <aside className={styles.bookingSummary}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryContent}>
                  <div className={styles.roomInfo}>
                    <h3 className={styles.roomName}>
                      Booking Summary
                    </h3>
                    <p className={styles.location}>
                      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      Ramachandrapuram, India
                    </p>
                  </div>

                  {/* Selected Rooms List */}
                  <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--foreground)' }}>
                      Selected Rooms ({selectedRoomsData?.rooms.length || 0})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {selectedRoomsData?.rooms.map((room, index) => (
                        <div key={room.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'var(--surface)', borderRadius: '0.375rem' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
                            {room.roomNumber} - {room.roomType.replace('_', ' ')}
                          </span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)' }}>
                            {formatCurrency(room.basePrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.dateInfo}>
                    <div className={styles.dateItem}>
                      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <div className={styles.dateDetails}>
                        <p className={styles.dateLabel}>Check-in</p>
                        <p className={styles.dateValue}>{formatDate(checkIn)}</p>
                      </div>
                    </div>
                    <div className={styles.dateItem}>
                      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <div className={styles.dateDetails}>
                        <p className={styles.dateLabel}>Check-out</p>
                        <p className={styles.dateValue}>{formatDate(checkOut)}</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.guestsInfo}>
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>{numberOfGuests} Adults, 0 Child • {nights} Nights</span>
                  </div>

                  <div className={styles.priceBreakdown}>
                    <div className={styles.priceItem}>
                      <span className={styles.priceLabel}>
                        {selectedRoomsData?.rooms.length || 0} Room{(selectedRoomsData?.rooms.length || 0) > 1 ? 's' : ''} x {nights} Night{nights > 1 ? 's' : ''}
                      </span>
                      <span className={styles.priceValue}>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className={styles.totalAmount}>
                      <span className={styles.totalLabel}>Total Amount</span>
                      <span className={styles.totalValue}>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={invalid || loading}
                    className={styles.completeButton}
                  >
                    {loading ? "Processing..." : "Complete Booking"}
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </button>

                  {/* Payment gateway text - commented out until integration */}
                  {/* <p className={styles.secureText}>Secure Checkout Powered by Lumina Pay</p> */}
                </div>
              </div>
            </aside>
          </div>
        </div>
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
