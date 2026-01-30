import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import {
  HOTEL,
  ROOM_CATEGORIES,
  STAY_POLICY,
  CONVENTIONS,
  formatPrice,
} from "@/lib/site-content";

export default function HomePage() {
  return (
    <div className="min-h-screen app-shell flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero – hotel feel */}
        <section className="relative max-w-6xl mx-auto px-4 pt-20 pb-28 md:pt-28 md:pb-36 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-glow)]/30 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
          <h1 className="font-heading text-4xl md:text-6xl font-medium text-slate-100 mb-5 tracking-tight animate-slide-up">
            {HOTEL.name}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up animate-stagger-1">
            {HOTEL.tagline}
          </p>
          <Link
            href="/book"
            className="btn-primary inline-flex items-center justify-center py-3.5 px-12 text-base tracking-wide transition-all duration-300 hover:scale-[1.03] animate-slide-up animate-stagger-2"
          >
            Book a room
          </Link>
        </section>

        {/* Rooms overview – premium rate cards */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <h2 className="section-title text-3xl md:text-4xl mb-2 animate-fade-in">
            Our rooms
          </h2>
          <p className="text-slate-400 mb-10 max-w-2xl animate-fade-in">
            Standard, Suite and Suite+ categories. 12–24 hour stays with
            transparent per-room pricing.
          </p>
          <div className="grid gap-6 sm:grid-cols-3 mb-10">
            {ROOM_CATEGORIES.map((cat, i) => (
              <Link
                key={cat.type}
                href="/rooms"
                className={`card-hotel p-6 block text-left hover:border-[var(--accent)]/40 transition-all duration-300 group animate-slide-up ${i === 0 ? "animate-stagger-1" : i === 1 ? "animate-stagger-2" : "animate-stagger-3"}`}
              >
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
                  From {formatPrice(cat.basePrice)}/day
                </span>
                <h3 className="font-heading text-xl font-medium text-slate-100 mt-2 mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {cat.type}
                </h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {cat.description}
                </p>
                <span className="text-sm text-slate-500">
                  {cat.rooms} · Floor {cat.floor}
                </span>
              </Link>
            ))}
          </div>
          <Link href="/book" className="btn-secondary py-3 px-8 transition-all duration-300 hover:scale-[1.02]">
            Check availability & book
          </Link>
        </section>

        {/* Conventions – function hall / events */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent-glow)]/15 to-transparent pointer-events-none rounded-3xl" />
          <div className="card-events p-8 md:p-10 relative animate-fade-in">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
              Function hall & events
            </span>
            <h2 className="section-title text-3xl md:text-4xl mt-2 mb-4">
              {CONVENTIONS.name}
            </h2>
            <p className="text-slate-300 text-lg mb-4 max-w-2xl leading-relaxed">
              {CONVENTIONS.description}
            </p>
            <p className="text-slate-400 mb-6">{CONVENTIONS.cta}</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/conventions" className="btn-primary py-2.5 px-6">
                Enquire for events
              </Link>
              <a
                href={`tel:${HOTEL.phone}`}
                className="btn-secondary py-2.5 px-6"
              >
                Call {HOTEL.phoneDisplay}
              </a>
            </div>
          </div>
        </section>

        {/* Stay policy */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <h2 className="section-title text-3xl mb-6">
            Stay policy
          </h2>
          <div className="card p-6 max-w-2xl">
            <ul className="text-slate-400 space-y-3 text-sm leading-relaxed">
              <li>Minimum stay: {STAY_POLICY.minStay}</li>
              <li>Maximum stay: {STAY_POLICY.maxStay}</li>
              <li>{STAY_POLICY.pricing}</li>
              <li>{STAY_POLICY.discount}</li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <h2 className="section-title text-3xl mb-6">
            Contact & location
          </h2>
          <div className="card p-6 max-w-xl">
            <p className="mb-2">
              <a
                href={`tel:${HOTEL.phone}`}
                className="text-[var(--accent)] hover:underline font-medium"
              >
                {HOTEL.phoneDisplay}
              </a>
            </p>
            <p className="mb-2">
              <a
                href={`mailto:${HOTEL.email}`}
                className="text-[var(--accent)] hover:underline"
              >
                {HOTEL.email}
              </a>
            </p>
            <p className="text-slate-400">{HOTEL.shortAddress}</p>
            <p className="text-slate-500 text-sm mt-2">{HOTEL.landmark}</p>
            <Link href="/contact" className="btn-secondary mt-5 inline-block">
              Full contact details
            </Link>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="max-w-6xl mx-auto px-4 py-16 border-t border-white/5 flex flex-wrap gap-4 justify-center">
          <Link href="/book" className="btn-primary py-3.5 px-10">
            Book a room
          </Link>
          <Link href="/my-booking" className="btn-secondary py-3.5 px-10">
            View my booking
          </Link>
          <Link href="/signup" className="btn-secondary py-3.5 px-10">
            Sign up
          </Link>
        </section>
      </main>
    </div>
  );
}
