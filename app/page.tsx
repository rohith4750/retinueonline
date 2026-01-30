import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen app-shell flex flex-col">
      <header className="app-header border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-100">
            Hotel The Retinue
          </span>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/book"
              className="text-slate-300 hover:text-sky-400 transition-colors"
            >
              Book a room
            </Link>
            <Link
              href="/my-booking"
              className="text-slate-300 hover:text-sky-400 transition-colors"
            >
              View my booking
            </Link>
            <Link
              href="/blog"
              className="text-slate-300 hover:text-sky-400 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/signup"
              className="text-slate-300 hover:text-sky-400 transition-colors"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Welcome to Hotel The Retinue
          </h1>
          <p className="text-slate-400 mb-8">
            Book your stay online. Check availability and manage your booking
            anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="btn-primary inline-flex items-center justify-center py-3 px-8 text-base"
            >
              Book a room
            </Link>
            <Link
              href="/my-booking"
              className="btn-secondary inline-flex items-center justify-center py-3 px-8 text-base"
            >
              View my booking
            </Link>
            <Link
              href="/blog"
              className="btn-secondary inline-flex items-center justify-center py-3 px-8 text-base"
            >
              Blog
            </Link>
            <Link
              href="/signup"
              className="btn-secondary inline-flex items-center justify-center py-3 px-8 text-base"
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
