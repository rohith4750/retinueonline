import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import { HOTEL, ABOUT_HOTEL } from "@/lib/site-content";

export default function AboutPage() {
  return (
    <div className="min-h-screen app-shell">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="mb-12">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
            About Us
          </span>
          <h1 className="section-title text-4xl md:text-5xl mt-2 mb-6">
            {ABOUT_HOTEL.headline}
          </h1>
          <p className="text-xl mb-6 leading-relaxed" style={{ color: "var(--foreground)" }}>
            {ABOUT_HOTEL.lead}
          </p>
          {ABOUT_HOTEL.body.map((para, i) => (
            <p key={i} className="text-lg mb-4 leading-relaxed max-w-3xl" style={{ color: "var(--muted)" }}>
              {para}
            </p>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 my-16">
          <div className="card p-6">
            <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ background: "var(--accent-soft)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="font-heading text-xl mb-2" style={{ color: "var(--foreground)" }}>Hospitality</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Warm, personalized service that makes every guest feel at home
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ background: "var(--accent-soft)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h3 className="font-heading text-xl mb-2" style={{ color: "var(--foreground)" }}>Quality</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Premium amenities and attention to detail in every aspect
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ background: "var(--accent-soft)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h3 className="font-heading text-xl mb-2" style={{ color: "var(--foreground)" }}>Comfort</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Thoughtfully designed spaces for relaxation and rejuvenation
            </p>
          </div>
        </div>

        <div className="card p-8 my-16">
          <h2 className="section-title text-2xl mb-6">Our Location</h2>
          <div className="space-y-4">
            <p className="text-lg" style={{ color: "var(--foreground)" }}>
              <strong>Address:</strong><br />
              {HOTEL.address}<br />
              {HOTEL.state} {HOTEL.pincode}
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              <strong>Landmark:</strong> {HOTEL.landmark}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/book" className="btn-primary py-3 px-8">
            Book Your Stay
          </Link>
          <Link href="/contact" className="btn-secondary py-3 px-8">
            Contact Us
          </Link>
        </div>
      </main>
    </div>
  );
}
