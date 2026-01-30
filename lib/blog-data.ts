export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "welcome-to-hotel-the-retinue",
    title: "Welcome to Hotel The Retinue",
    excerpt:
      "Discover comfort and convenience at The Retinue. Book your stay online and enjoy a seamless experience from check-in to check-out.",
    date: "2025-01-15",
    author: "The Retinue",
  },
  {
    slug: "how-to-book-online",
    title: "How to Book Online",
    excerpt:
      "A simple guide to checking availability, choosing your room, and confirming your booking in just a few steps.",
    date: "2025-01-10",
    author: "The Retinue",
  },
  {
    slug: "view-and-manage-your-booking",
    title: "View and Manage Your Booking",
    excerpt:
      "Use your booking reference and phone number to view your reservation anytime. No login required.",
    date: "2025-01-05",
    author: "The Retinue",
  },
];
