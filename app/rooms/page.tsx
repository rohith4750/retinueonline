import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import {
  HOTEL,
  ROOM_CATEGORIES,
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

function RoomImage({ roomType }: { roomType: string }) {
  const src = ROOM_IMAGE_MAP[roomType] ?? IMAGES.standardRoom;
  return (
    <div className="section-image aspect-[4/3] rounded-2xl min-h-[200px] overflow-hidden relative bg-slate-800/50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${roomType} room`}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

export default function RoomsPage() {
  return (
    <div className="min-h-screen app-shell">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        {/* Lead – hygiene & celebrity */}
        <div className="mb-14 md:mb-16">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
            {ROOMS_HIGHLIGHT.badge}
          </span>
          <h1 className="section-title text-4xl md:text-5xl mt-2 mb-4">
            Our Featured Rooms
          </h1>
          <p className="text-lg mb-4 max-w-2xl leading-relaxed" style={{ color: "var(--foreground)" }}>
            {HOTEL.tagline}
          </p>
          <p className="mb-2 max-w-2xl" style={{ color: "var(--muted)" }}>
            {ROOMS_HIGHLIGHT.hygiene}
          </p>
          <p className="max-w-2xl" style={{ color: "var(--muted)" }}>
            {ROOMS_HIGHLIGHT.celebrity}
          </p>
        </div>

        {/* Room categories with image placeholders */}
        <div className="space-y-12 md:space-y-16">
          {ROOM_CATEGORIES.map((cat, i) => (
            <div
              key={cat.type}
              className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <RoomImage roomType={cat.type} />
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
                  FLOOR {cat.floor}
                </span>
                <h2 className="section-title text-2xl md:text-3xl mt-1 mb-3">
                  The {cat.type}
                </h2>
                <p className="mb-4 max-w-xl leading-relaxed" style={{ color: "var(--muted)" }}>
                  {cat.description}
                </p>
                <p className="text-sm mb-6" style={{ color: "var(--muted-2)" }}>
                  {cat.rooms} · 🛏️ King size bed · 🌟 4.0 (24 reviews)
                </p>
                <div className="flex flex-wrap items-baseline gap-2 mb-6">
                  <p className="text-3xl md:text-4xl font-semibold text-[var(--accent)]">
                    {formatPrice(cat.basePrice)}
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>/night</p>
                </div>
                <Link
                  href="/book"
                  className="btn-primary inline-block py-3 px-8"
                >
                  Reserve Your Stay
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Short reviews strip */}
        <section className="mt-16 pt-16 border-t" style={{ borderColor: "rgba(44, 36, 22, 0.1)" }}>
          <h3 className="section-title text-2xl mb-8">Guest Reviews</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <div key={i} className="testimonial-quote">
                <div className="flex gap-1 mb-2 text-[var(--accent)] text-sm">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} aria-hidden>★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "var(--foreground)" }}>&ldquo;{t.quote}&rdquo;</p>
                <p className="font-medium text-sm mt-3" style={{ color: "var(--foreground)" }}>{t.name}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-14 flex flex-wrap gap-4">
          <Link href="/book" className="btn-primary py-3.5 px-10">
            Check availability & book
          </Link>
          <Link href="/" className="btn-secondary py-3.5 px-10">
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
