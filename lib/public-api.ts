/**
 * Public API client for Hotel The Retinue – customer booking portal.
 * Backend: https://hoteltheretinue.in
 */

const API_BASE =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE) ||
  "https://hoteltheretinue.in/api/public";

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
  phone: string;
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
}

export async function sendOtp(phone: string): Promise<ApiResponse<SendOtpData>> {
  return publicApi<SendOtpData>("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ phone: phone.replace(/\D/g, "").slice(-10) }),
  });
}

export async function verifyOtp(
  phone: string,
  otp: string
): Promise<ApiResponse<VerifyOtpData>> {
  return publicApi<VerifyOtpData>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({
      phone: phone.replace(/\D/g, "").slice(-10),
      otp: otp.replace(/\D/g, ""),
    }),
  });
}

export async function completeSignup(
  signupToken: string,
  body: { name: string; email?: string; address?: string }
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
