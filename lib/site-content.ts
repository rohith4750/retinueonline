/**
 * Hotel The Retinue – marketing & site content
 */

export const HOTEL = {
  name: "Hotel The Retinue & Buchiraju Conventions",
  tagline:
    "Comfortable stays in Ramachandrapuram. Standard rooms, Suites and Suite+ with 12–24 hour stay and transparent pricing.",
  shortTagline: "Comfortable stays in Ramachandrapuram.",
  email: "hoteltheretinue@gmail.com",
  phone: "7675800901",
  phoneDisplay: "767 580 0901",
  address: "2P-1-8, Chelikani Ramarao veedhi, Ramachandrapuram 533255",
  shortAddress: "Main Rd, Ramachandrapuram, Andhra Pradesh",
  landmark:
    "Main Road, Ramachandrapuram, Rajgopal Centre, Near HP Petrol Bank, Near Reliance Trends, 2nd Floor, Hotel The Retinue",
  state: "Andhra Pradesh",
  pincode: "533255",
} as const;

export const ROOM_CATEGORIES = [
  {
    type: "Standard",
    description: "Comfortable rooms for couples or small families.",
    rooms: "101, 102, 103, 104",
    floor: 1,
    basePrice: 2500,
    capacity: 2,
  },
  {
    type: "Suite",
    description: "Spacious suites for longer stays or groups.",
    rooms: "Suite-1, Suite-2, Suite-3, Suite-4",
    floor: 2,
    basePrice: 3500,
    capacity: 4,
  },
  {
    type: "Suite+",
    description: "Premium suites with extra space and comfort.",
    rooms: "Suite-+1, Suite-+2",
    floor: 2,
    basePrice: 4000,
    capacity: 4,
  },
] as const;

export const STAY_POLICY = {
  minStay: "12 hours",
  maxStay: "24 hours (one calendar day)",
  pricing: "Per room per day at base price; GST 18% on (base − discount).",
  discount: "Up to 50% of base allowed.",
  earlyCheckout:
    "Stay < 12h: minimum 50% of base + GST. Stay ≥ 12h: charged by full day(s).",
  included: "Room for 12–24 hours; pricing per room (subject to capacity).",
} as const;

export const CONVENTIONS = {
  name: "Butchiraju Conventions",
  subtitle: "Function hall for events",
  description:
    "Our function hall is ideal for weddings, birthdays, conferences, and private events. AC, projector, stage, and flexible capacity. Booking is managed directly with the hotel.",
  cta: "Contact us for capacity, availability, and pricing.",
  contactNote: "Call or email to book the function hall.",
} as const;

export const WHAT_WE_OFFER = [
  "Standard, Suite and Suite+ rooms.",
  "12–24 hour stays; check-in and check-out as per policy.",
  "Per room per day pricing, 18% GST; discounts up to 50% of base.",
  "Function hall (Butchiraju Conventions) for events – contact hotel to book.",
  "Phone 7675800901, email hoteltheretinue@gmail.com, Main Rd, Ramachandrapuram, Andhra Pradesh 533255.",
] as const;

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
