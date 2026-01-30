/**
 * Public API client for Hotel The Retinue – customer booking portal.
 * Backend: https://hoteltheretinue.in
 * Set NEXT_PUBLIC_USE_API_PROXY=true in .env.local to avoid CORS when developing on localhost.
 */

const REMOTE_API_BASE =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE) ||
  "https://hoteltheretinue.in/api/public";

const USE_PROXY =
  typeof process !== "undefined" &&
  process.env?.NEXT_PUBLIC_USE_API_PROXY === "true";

const API_BASE = USE_PROXY ? "/api/proxy" : REMOTE_API_BASE;

export type ApiSuccess<T> = { success: true; data: T; message?: string };
export type ApiError = {
  success: false;
  error: string;
  message: string;
  code?: string;
};
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function isApiError(r: ApiResponse<unknown>): r is ApiError {
  return r.success === false;
}

export async function publicApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok) {
    return { ...json, success: false } as ApiError;
  }
  return json as ApiSuccess<T>;
}

/** Authenticated request with Bearer token (e.g. customerToken for booking history). */
export async function publicApiWithToken<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok) {
    return { ...json, success: false } as ApiError;
  }
  return json as ApiSuccess<T>;
}

// --- Types from API ---

export type RoomType =
  | "SINGLE"
  | "DOUBLE"
  | "DELUXE"
  | "STANDARD"
  | "SUITE"
  | "SUITE_PLUS";

export type RoomStatus = "AVAILABLE" | "BOOKED" | "MAINTENANCE";

export interface RoomAvailable {
  id: string;
  roomNumber: string;
  roomType: RoomType;
  floor: number;
  basePrice: number;
  capacity: number;
  status: RoomStatus;
  maintenanceReason: string | null;
  createdAt: string;
  updatedAt: string;
  checkInAt: string | null;
  checkOutAt: string | null;
}

export interface AvailableRoomsData {
  rooms: RoomAvailable[];
  dateRange: { checkIn: string; checkOut: string } | null;
  bookedRoomCount: number;
  availableRoomCount: number;
}

export interface CreateBookingBody {
  roomId: string;
  guestName: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guestIdProof?: string;
  guestAddress?: string;
  numberOfGuests?: number;
  discount?: number;
  advanceAmount?: number;
  applyGst?: boolean;
  flexibleCheckout?: boolean;
}

export interface CreateBookingData {
  bookingId: string;
  bookingReference: string;
  guestName: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  roomNumber: string;
  roomType: string;
  totalAmount: number;
  status: string;
  message?: string;
}

export interface ViewBookingData {
  bookingId: string;
  bookingReference: string;
  checkIn: string;
  checkOut: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  guestName: string;
  guestPhone: string;
  roomNumber: string;
  roomType: string;
  numberOfGuests: number;
}

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  SINGLE: "Single",
  DOUBLE: "Double",
  DELUXE: "Deluxe",
  STANDARD: "Standard",
  SUITE: "Suite",
  SUITE_PLUS: "Suite Plus",
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// --- Auth (OTP sign-up) ---

export interface SendOtpData {
  expiresIn: number;
}

export interface VerifyOtpData {
  signupToken: string;
  /** Present when phone/email belongs to existing customer – use for "My Bookings" */
  customerToken?: string;
  email?: string;
  phone?: string;
  expiresIn: number;
}

export interface Customer {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SignupData {
  customer: Customer;
  /** JWT for "My Bookings" – store in localStorage and send as Authorization: Bearer */
  customerToken?: string;
}

export async function sendOtp(email: string): Promise<ApiResponse<SendOtpData>> {
  return publicApi<SendOtpData>("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
}

export async function verifyOtp(
  email: string,
  otp: string
): Promise<ApiResponse<VerifyOtpData>> {
  return publicApi<VerifyOtpData>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      otp: otp.replace(/\D/g, ""),
    }),
  });
}

export async function completeSignup(
  signupToken: string,
  body: { name: string; phone: string; address?: string }
): Promise<ApiResponse<SignupData>> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${signupToken}`,
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as ApiResponse<SignupData>;
  if (!res.ok) return { ...json, success: false } as ApiError;
  return json as ApiSuccess<SignupData>;
}

// --- Booking history (GET /bookings/history with Authorization: Bearer customerToken) ---

export interface BookingHistoryItem extends ViewBookingData {
  bookingDate?: string;
}

export async function getBookingHistory(
  customerToken: string
): Promise<ApiResponse<BookingHistoryItem[]>> {
  return publicApiWithToken<BookingHistoryItem[]>("/bookings/history", customerToken);
}
