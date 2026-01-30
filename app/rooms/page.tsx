import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import {
  HOTEL,
  ROOM_CATEGORIES,
  STAY_POLICY,
  formatPrice,
} from "@/lib/site-content";

export default function RoomsPage() {
  return (
    <div className="min-h-screen app-shell">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-14 md:py-16">
        <h1 className="section-title text-4xl md:text-5xl mb-3">
          Rooms & tariff
        </h1>
        <p className="text-slate-400 text-lg mb-12 max-w-2xl">
          {HOTEL.tagline} All rates are per room per day (12–24 hour stay).
        </p>

        <div className="space-y-6">
          {ROOM_CATEGORIES.map((cat) => (
            <div key={cat.type} className="card-hotel p-6 md:p-8">
              <div className="flex flex-wrap justify-between items-start gap-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
                    Floor {cat.floor}
                  </span>
                  <h2 className="section-title text-2xl md:text-3xl mt-1 mb-2">
                    {cat.type}
                  </h2>
                  <p className="text-slate-400 mb-2 max-w-xl">{cat.description}</p>
                  <p className="text-slate-500 text-sm">
                    Rooms: {cat.rooms} · Up to {cat.capacity} guests
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl md:text-3xl font-semibold text-[var(--accent)]">
                    {formatPrice(cat.basePrice)}
                  </p>
                  <p className="text-slate-500 text-sm mt-1">per day</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6 mt-10">
          <h3 className="section-title text-xl mb-4">Stay & pricing</h3>
          <ul className="text-slate-400 text-sm space-y-2 leading-relaxed">
            <li>• {STAY_POLICY.minStay} – {STAY_POLICY.maxStay}</li>
            <li>• {STAY_POLICY.pricing}</li>
            <li>• {STAY_POLICY.discount}</li>
            <li>• {STAY_POLICY.earlyCheckout}</li>
            <li>• {STAY_POLICY.included}</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
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
