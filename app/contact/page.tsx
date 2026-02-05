import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import { HOTEL } from "@/lib/site-content";

export default function ContactPage() {
  return (
    <div className="min-h-screen app-shell">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-14 md:py-16">
        <h1 className="font-heading text-4xl md:text-5xl mb-2 font-light">
          <span style={{ color: "var(--foreground)" }}>Let's stay </span>
          <span style={{ color: "var(--accent)" }} className="italic">connected</span>
          <span style={{ color: "var(--foreground)" }}>.</span>
        </h1>
        <p className="mb-12 max-w-2xl leading-relaxed" style={{ color: "var(--muted)" }}>
          Whether you have a specific question about a room layout or you're ready to start planning your wedding at the convention center, our team is here to help. Drop us a message or stop by we'd love to show you around.
        </p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form */}
          <div>
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="form-label text-xs uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="form-label text-xs uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="form-label text-xs uppercase tracking-wider">Message</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  placeholder="Your message here..."
                />
              </div>
              <button type="submit" className="btn-primary py-3 px-8">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card p-6 space-y-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold mb-2">
                  Office Location
                </p>
                <p style={{ color: "var(--foreground)" }} className="leading-relaxed">
                  {HOTEL.address}<br />
                  {HOTEL.state} {HOTEL.pincode}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold mb-2">
                  Phone
                </p>
                <a
                  href={`tel:${HOTEL.phone}`}
                  className="text-[var(--accent)] hover:underline text-lg font-medium"
                >
                  {HOTEL.phoneDisplay}
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold mb-2">
                  Social Presence
                </p>
                <div className="flex gap-3">
                  <a href="#" className="text-[var(--accent)] hover:underline">Instagram</a>
                  <a href="#" className="text-[var(--accent)] hover:underline">Youtube</a>
                  <a href="#" className="text-[var(--accent)] hover:underline">Whatsapp</a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/book" className="btn-primary py-3 px-8">
                Book a room
              </Link>
              <Link href="/" className="btn-secondary py-3 px-8">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
