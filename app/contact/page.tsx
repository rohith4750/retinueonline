import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import { HOTEL } from "@/lib/site-content";

export default function ContactPage() {
  return (
    <div className="min-h-screen app-shell">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-14 md:py-16">
        <h1 className="section-title text-4xl md:text-5xl mb-4">
          Contact & location
        </h1>
        <p className="text-slate-400 mb-12 max-w-2xl">
          Reach us by phone, email, or visit us at Ramachandrapuram.
        </p>

        <div className="card p-8 md:p-10 space-y-6 max-w-xl">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold mb-1">
              Phone
            </p>
            <a
              href={`tel:${HOTEL.phone}`}
              className="text-[var(--accent)] hover:underline text-xl font-medium"
            >
              {HOTEL.phoneDisplay}
            </a>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold mb-1">
              Email
            </p>
            <a
              href={`mailto:${HOTEL.email}`}
              className="text-[var(--accent)] hover:underline"
            >
              {HOTEL.email}
            </a>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold mb-1">
              Address
            </p>
            <p className="text-slate-300">{HOTEL.address}</p>
            <p className="text-slate-500 text-sm mt-1">
              {HOTEL.state} {HOTEL.pincode}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold mb-1">
              Landmark
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">{HOTEL.landmark}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/book" className="btn-primary py-3.5 px-10">
            Book a room
          </Link>
          <Link href="/" className="btn-secondary py-3.5 px-10">
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
