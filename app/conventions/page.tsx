import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import { CONVENTIONS, HOTEL } from "@/lib/site-content";

export default function ConventionsPage() {
  return (
    <div className="min-h-screen app-shell">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-14 md:py-16">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
          Function hall & events
        </span>
        <h1 className="section-title text-4xl md:text-5xl mt-2 mb-3">
          {CONVENTIONS.name}
        </h1>
        <p className="text-slate-400 text-lg mb-2">{CONVENTIONS.subtitle}</p>
        <p className="text-slate-400 mb-12 max-w-2xl leading-relaxed">
          {CONVENTIONS.description}
        </p>

        <div className="card-events p-8 md:p-10 mb-10">
          <p className="text-slate-200 text-lg mb-3">{CONVENTIONS.cta}</p>
          <p className="text-slate-500 text-sm mb-6">{CONVENTIONS.contactNote}</p>
          <div className="flex flex-wrap gap-4">
            <a
              href={`tel:${HOTEL.phone}`}
              className="btn-primary py-3 px-8"
            >
              Call {HOTEL.phoneDisplay}
            </a>
            <a
              href={`mailto:${HOTEL.email}`}
              className="btn-secondary py-3 px-8"
            >
              Email us
            </a>
          </div>
        </div>

        <Link href="/" className="btn-secondary py-2.5 px-6">
          Back to home
        </Link>
      </main>
    </div>
  );
}
