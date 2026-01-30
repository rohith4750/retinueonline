import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import {
  HOTEL,
  ROOM_CATEGORIES,
  STAY_POLICY,
  CONVENTIONS,
  ABOUT_HOTEL,
  ROOMS_HIGHLIGHT,
  TESTIMONIALS,
  IMAGES,
  formatPrice,
} from "@/lib/site-content";

const ROOM_IMAGE_MAP: Record<string, string> = {
  Standard: IMAGES.standardRoom,
  Suite: IMAGES.suite,
  "Suite+": IMAGES.suitePlus,
};

function HeroImage() {
  return (
    <div className="section-image aspect-[21/9] min-h-[220px] md:min-h-[320px] rounded-3xl overflow-hidden relative bg-slate-800/50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMAGES.hero}
        alt="Hotel The Retinue – exterior"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

function AboutImage() {
  return (
    <div className="section-image aspect-[4/3] rounded-2xl overflow-hidden relative min-h-[280px] bg-slate-800/50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMAGES.about}
        alt="Hotel lobby – comfortable stay"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen app-shell flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero – connecting visual first */}
        <section className="max-w-6xl mx-auto px-4 pt-8 pb-6 md:pt-10 md:pb-8">
          <HeroImage />
        </section>

        {/* Hero text – flows from the image */}
        <section className="relative max-w-6xl mx-auto px-4 pt-6 pb-12 md:pt-8 md:pb-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-glow)]/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
          <h1 className="font-heading text-4xl md:text-6xl font-medium text-slate-100 mb-5 tracking-tight animate-slide-up relative">
            {HOTEL.name}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up animate-stagger-1 relative">
            {HOTEL.tagline}
          </p>
          <Link
            href="/book"
            className="btn-primary inline-flex items-center justify-center py-3.5 px-12 text-base tracking-wide transition-all duration-300 hover:scale-[1.03] animate-slide-up animate-stagger-2 relative"
          >
            Book a room
          </Link>
        </section>

        {/* About – connecting content */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
                About us
              </span>
              <h2 className="section-title text-3xl md:text-4xl mt-2 mb-6">
                {ABOUT_HOTEL.headline}
              </h2>
              <p className="text-slate-300 text-lg mb-4 leading-relaxed">
                {ABOUT_HOTEL.lead}
              </p>
              {ABOUT_HOTEL.body.map((para, i) => (
                <p key={i} className="text-slate-400 mb-4 leading-relaxed">
                  {para}
                </p>
              ))}
              <Link href="/rooms" className="btn-secondary py-2.5 px-6 inline-block mt-2">
                {ABOUT_HOTEL.cta}
              </Link>
            </div>
            <div className="relative">
              <AboutImage />
            </div>
          </div>
        </section>

        {/* Rooms – hygiene & celebrity messaging, with image areas */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent-glow)]/10 to-transparent pointer-events-none rounded-3xl" />
          <div className="relative">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
              {ROOMS_HIGHLIGHT.badge}
            </span>
            <h2 className="section-title text-3xl md:text-4xl mt-2 mb-3">
              Our rooms
            </h2>
            <p className="text-slate-400 mb-4 max-w-2xl">
              {ROOMS_HIGHLIGHT.hygiene}
            </p>
            <p className="text-slate-400 mb-12 max-w-2xl">
              {ROOMS_HIGHLIGHT.celebrity}
            </p>
            <div className="grid gap-8 sm:grid-cols-3">
              {ROOM_CATEGORIES.map((cat, i) => (
                <Link
                  key={cat.type}
                  href="/rooms"
                  className="card-hotel block text-left overflow-hidden group animate-fade-in"
                >
                  <div className="section-image aspect-[4/3] relative overflow-hidden bg-slate-800/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ROOM_IMAGE_MAP[cat.type] ?? IMAGES.standardRoom}
                      alt={`${cat.type} room`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
                      From {formatPrice(cat.basePrice)}/day
                    </span>
                    <h3 className="font-heading text-xl font-medium text-slate-100 mt-2 mb-2 group-hover:text-[var(--accent)] transition-colors">
                      {cat.type}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                    <span className="text-slate-500 text-sm">
                      {cat.rooms} · Floor {cat.floor}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/book" className="btn-primary py-3 px-8">
                Check availability & book
              </Link>
              <Link href="/rooms" className="btn-secondary py-3 px-8">
                View all rooms & tariff
              </Link>
            </div>
          </div>
        </section>

        {/* Customer reviews – connecting trust */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
            What guests say
          </span>
          <h2 className="section-title text-3xl md:text-4xl mt-2 mb-12">
            Reviews from our guests
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="testimonial-quote animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex gap-1 mb-3 text-[var(--accent)]">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} aria-hidden>★</span>
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-slate-100 font-medium">{t.name}</p>
                <p className="text-slate-500 text-sm">{t.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conventions – function hall */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent-glow)]/15 to-transparent pointer-events-none rounded-3xl" />
          <div className="card-events p-8 md:p-10 relative">
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
              <a href={`tel:${HOTEL.phone}`} className="btn-secondary py-2.5 px-6">
                Call {HOTEL.phoneDisplay}
              </a>
            </div>
          </div>
        </section>

        {/* Stay policy */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <h2 className="section-title text-3xl mb-6">Stay policy</h2>
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
          <h2 className="section-title text-3xl mb-6">Contact & location</h2>
          <div className="card p-6 max-w-xl">
            <p className="mb-2">
              <a href={`tel:${HOTEL.phone}`} className="text-[var(--accent)] hover:underline font-medium">
                {HOTEL.phoneDisplay}
              </a>
            </p>
            <p className="mb-2">
              <a href={`mailto:${HOTEL.email}`} className="text-[var(--accent)] hover:underline">
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
          <Link href="/signup" className="btn-secondary py-3.5 px-10">
            Sign up
          </Link>
        </section>
      </main>
    </div>
  );
}
