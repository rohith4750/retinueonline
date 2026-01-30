/**
 * Hotel The Retinue – marketing & site content
 */

/** Image URLs. Hero & about = local hotel-themed images (always load, on-brand). Add hotel-exterior.jpg / hotel-lobby.jpg for real photos. */
export const IMAGES = {
  hero: "/images/hotel-exterior.svg",
  about: "/images/hotel-lobby.svg",
  standardRoom:
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  suite:
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
  suitePlus:
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
} as const;

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

/** About the hotel – premium, connecting copy */
export const ABOUT_HOTEL = {
  headline: "Where comfort meets care",
  lead:
    "Hotel The Retinue & Buchiraju Conventions is Ramachandrapuram’s choice for a calm, clean stay—whether you’re passing through or here for an event.",
  body: [
    "We focus on spotless rooms, clear pricing, and a welcoming team. Our rooms are among the most hygienic in the area, with regular deep cleaning and fresh linen so every guest steps into a space that feels new.",
    "Our Standard, Suite, and Suite+ rooms are favoured by celebrities, artists, and discerning travellers who expect quality and privacy. When you book with us, you’re choosing the same standards that keep our regulars coming back.",
  ],
  cta: "Explore our rooms and book your stay.",
} as const;

/** Rooms: hygiene + celebrity positioning */
export const ROOMS_HIGHLIGHT = {
  hygiene:
    "Our rooms are among the most hygienic in the region. Deep-cleaned between every stay, fresh linen, and strict housekeeping standards so you can relax in complete confidence.",
  celebrity:
    "Many of our rooms are regularly chosen by celebrities and well-known guests who value cleanliness, comfort, and discretion. Experience the same high standards.",
  badge: "Hygienic · Trusted · Celebrity favourite",
} as const;

/** Customer reviews / testimonials */
export const TESTIMONIALS = [
  {
    name: "Rajesh K.",
    role: "Business traveller, Hyderabad",
    quote:
      "Clean rooms, quiet, and the staff was very helpful. Felt safe and comfortable. Will book again.",
    rating: 5,
  },
  {
    name: "Lakshmi M.",
    role: "Family stay, Vijayawada",
    quote:
      "One of the cleanest hotels we’ve stayed in. The suite was spacious and the kids loved it. Highly recommend.",
    rating: 5,
  },
  {
    name: "Suresh & Priya",
    role: "Wedding guests",
    quote:
      "We had our family function at Butchiraju Conventions and stayed here. Rooms were spotless and the hall was perfect. Everything was well organised.",
    rating: 5,
  },
  {
    name: "Anonymous",
    role: "Frequent guest",
    quote:
      "I stay here often for work. Always clean, always professional. Feels like a second home.",
    rating: 5,
  },
] as const;

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
