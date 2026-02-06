import type { Metadata } from "next";
import { Outfit, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hotel The Retinue | Book Online",
  description: "Book your stay online. Check availability and manage your booking.",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/logo-badge.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/logo-badge.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${geistMono.variable} ${cormorant.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
