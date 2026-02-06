import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import {
  HOTEL,
  ROOM_CATEGORIES,
  CONVENTIONS,
  TESTIMONIALS,
  IMAGES,
  formatPrice,
  getYearsOfOperation,
} from "@/lib/site-content";
import styles from "./page.module.scss";

const ROOM_IMAGE_MAP: Record<string, string> = {
  Standard: IMAGES.standardRoom,
  Suite: IMAGES.suite,
  "Suite+": IMAGES.suitePlus,
};

export default function HomePage() {
  return (
    <div className={styles.landingPage}>
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroGrid}>
            {/* Left Content */}
            <div className={styles.heroContent}>
              <p className={`${styles.preTitle} animate-slide-up animate-stagger-1`}>Not just a stay</p>
              <h1 className={`${styles.title} animate-slide-up animate-stagger-2`}>
                <span className={styles.mainText}>The </span>
                <span className={styles.accentText}>Retinue</span>
              </h1>
              <p className={`${styles.subtitle} animate-slide-up animate-stagger-3`}>It's a whole mood...</p>
              <p className={`${styles.description} animate-slide-up animate-stagger-4`}>
                Whether you're exploring the vibrant city, hosting your dream event, or just seeking a peaceful escape – Hotel The Retinue is your perfect sanctuary. With thoughtfully designed rooms, exceptional service, and the elegance of Buchiraju Conventions, every moment here is crafted to feel extraordinary.
              </p>

              {/* Key Features */}
              <div className={`${styles.featuresList} animate-slide-up animate-stagger-5`}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <p className={styles.featureText}>Premium rooms with modern amenities</p>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <p className={styles.featureText}>Celebrity-favourite hospitality standards</p>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <p className={styles.featureText}>World-class convention facilities</p>
                </div>
              </div>

              <div className="animate-slide-up animate-stagger-5">
                <Link href="/book" className={`${styles.primaryButton} animate-pulse-glow`}>
                  Book Now
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Decorative branch illustration */}
              <div className={styles.decorativeBranch}>
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" stroke="var(--accent)" strokeWidth="1">
                  <path d="M10 30 Q 30 20, 50 30 T 90 30" strokeLinecap="round" />
                  <circle cx="20" cy="25" r="2" fill="var(--accent)" />
                  <circle cx="40" cy="35" r="2" fill="var(--accent)" />
                  <circle cx="60" cy="28" r="2" fill="var(--accent)" />
                  <circle cx="80" cy="32" r="2" fill="var(--accent)" />
                </svg>
              </div>
            </div>

            {/* Right Image */}
            <div className={`${styles.heroImageContainer} animate-float`}>
              <div className={styles.mainImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMAGES.hotelExterior}
                  alt="Hotel The Retinue - Luxury hotel exterior with modern architecture"
                />
              </div>
              {/* Floating badge */}
              <div className={styles.floatingBadge}>
                <p>{getYearsOfOperation()}+ Years</p>
              </div>
              {/* Additional small image overlay */}
              <div className={styles.overlayImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMAGES.standardRoom}
                  alt="Luxury hotel room interior with king bed"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        {/* About Us Section */}
        <section className={`${styles.aboutSection} animate-slide-up`}>
          <div className={styles.aboutGrid}>
            {/* Left Content */}
            <div className={styles.aboutContent}>
              <p className={styles.badge}>ABOUT US</p>
              <h2 className={styles.heading}>
                <span className={styles.normalText}>Where </span>
                <span className={styles.accentText}>comfort</span>
                <span className={styles.normalText}> meets</span>
                <br />
                <span className={styles.normalText}>care...</span>
              </h2>
              <p className={styles.paragraph}>
                At Hotel The Retinue, we believe hospitality is more than just a service—it's an art. Located in the heart of Ramachandrapuram, we've been creating memorable experiences for over {getYearsOfOperation()} years, offering premium accommodations paired with warm, personalized service.
              </p>
              <p className={styles.paragraph}>
                From our elegantly appointed Standard rooms to our luxurious Suite+ options, every space is designed with your comfort in mind. Whether you're traveling for business, leisure, or celebrating life's special moments at Buchiraju Conventions, we ensure every detail reflects our commitment to excellence.
              </p>

              {/* Stats Grid */}
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <p className={styles.statValue}>1K+</p>
                  <p className={styles.statLabel}>Happy Guests</p>
                </div>
                <div className={`${styles.statItem} ${styles.bordered}`}>
                  <p className={styles.statValue}>500+</p>
                  <p className={styles.statLabel}>Events Hosted</p>
                </div>
                <div className={styles.statItem}>
                  <p className={styles.statValue}>4.9★</p>
                  <p className={styles.statLabel}>Guest Rating</p>
                </div>
              </div>

              <p className={styles.paragraph}>
                Experience the perfect blend of modern amenities, attentive service, and a welcoming atmosphere that makes Hotel The Retinue your home away from home.
              </p>
              <Link href="/rooms" className={styles.secondaryButton}>
                Explore Our Rooms
              </Link>
            </div>

            {/* Right Images Grid */}
            <div className={styles.imageGrid}>
              {/* Main large image - Hotel Lobby */}
              <div className={styles.mainImageLarge}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMAGES.hotelLobby}
                  alt="Hotel The Retinue - Elegant lobby with modern reception desk"
                />
              </div>
              {/* Two smaller images */}
              <div className={styles.smallImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMAGES.suite}
                  alt="Luxury suite with elegant furnishings and comfortable seating"
                />
              </div>
              <div className={styles.smallImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMAGES.suitePlus}
                  alt="Premium Suite Plus with spacious layout and modern design"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        {/* Why Choose Us Section */}
        <section className={`${styles.whySection} animate-slide-up`}>
          <div className={styles.sectionHeader}>
            <p className={styles.badge}>WHY CHOOSE US</p>
            <h2 className={styles.heading}>Experience Excellence in Every Stay</h2>
          </div>

          <div className={styles.cardsGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Premium Accommodations</h3>
              <p className={styles.cardDescription}>
                Thoughtfully designed rooms with modern amenities, ensuring comfort and luxury for every guest
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Flexible Stay Options</h3>
              <p className={styles.cardDescription}>
                12-24 hour stay policies with transparent pricing and no hidden charges for your convenience
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Event Excellence</h3>
              <p className={styles.cardDescription}>
                World-class convention facilities at Buchiraju Conventions for memorable celebrations
              </p>
            </div>
          </div>
        </section>

        {/* Our Featured Rooms */}
        {/* Our Featured Rooms */}
        <section className={`${styles.roomsSection} animate-slide-up`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.heading}>Our Featured Rooms</h2>
            <p className={styles.description}>
              Experience luxury and comfort in our thoughtfully designed rooms, each offering modern amenities and a welcoming ambiance perfect for your stay.
            </p>
          </div>

          <div className={styles.roomsGrid}>
            {ROOM_CATEGORIES.map((cat) => (
              <div key={cat.type} className={styles.roomCard}>
                {/* Room Badge */}
                <div className={styles.roomImageContainer}>
                  <div className={styles.roomImage}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ROOM_IMAGE_MAP[cat.type] ?? IMAGES.standardRoom}
                      alt={`${cat.type} room`}
                    />
                  </div>
                  <div className={styles.featuredBadge}>FEATURED</div>
                </div>

                <div className={styles.roomContent}>
                  <div className={styles.roomHeader}>
                    <h3 className={styles.roomTitle}>{cat.type}</h3>
                    <p className={styles.roomPrice}>{formatPrice(cat.basePrice)}</p>
                  </div>

                  <div className={styles.roomRating}>
                    <div className={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className={styles.ratingText}>(4.8)</span>
                  </div>

                  <p className={styles.roomDescription}>{cat.description}</p>

                  <div className={styles.roomTags}>
                    <span className={styles.tag}>{cat.rooms}</span>
                    <span className={styles.tag}>Floor {cat.floor}</span>
                  </div>

                  <Link href="/book" className={styles.bookButton}>
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conventions Section */}
        {/* Conventions Section */}
        <section className={`${styles.conventionsSection} animate-slide-up`}>
          <div className={styles.conventionsContainer}>
            <div className={styles.conventionsGrid}>
              {/* Left Content */}
              <div className={styles.conventionsContent}>
                <p className={styles.badge}>EVENTS & CELEBRATIONS</p>
                <h2 className={styles.heading}>
                  <span className={styles.normalText}>Moments Made Memorable</span>
                </h2>
                <h3 className={styles.subtitle}>Buchiraju Conventions</h3>
                <p className={styles.paragraph}>{CONVENTIONS.description}</p>
                <p className={styles.paragraph}>
                  From intimate gatherings to grand celebrations, our state-of-the-art convention hall provides the perfect setting for weddings, corporate events, conferences, and special occasions. With modern amenities, elegant decor, and dedicated event coordination, we ensure every detail of your event is flawlessly executed.
                </p>

                {/* Convention Features */}
                <div className={styles.conventionFeatures}>
                  <div className={styles.featureItem}>
                    <div className={styles.featureIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className={styles.featureText}>Fully air-conditioned hall with flexible seating capacity</p>
                  </div>
                  <div className={styles.featureItem}>
                    <div className={styles.featureIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className={styles.featureText}>Modern AV equipment, projector, and stage setup</p>
                  </div>
                  <div className={styles.featureItem}>
                    <div className={styles.featureIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className={styles.featureText}>Elegant decor and customizable event arrangements</p>
                  </div>
                  <div className={styles.featureItem}>
                    <div className={styles.featureIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className={styles.featureText}>Dedicated event coordination and support staff</p>
                  </div>
                </div>

                <div className={styles.buttonGroup}>
                  <Link href="/conventions" className={styles.primaryButton}>
                    Book Your Event
                  </Link>
                  <a href={`tel:${HOTEL.phone}`} className={styles.secondaryButton}>
                    Call {HOTEL.phoneDisplay}
                  </a>
                </div>
              </div>

              {/* Right Images - Convention Hall Images */}
              <div className={styles.conventionsImages}>
                {/* Large convention hall image */}
                <div className={styles.largeConventionImage}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={IMAGES.conventionHall}
                    alt="Buchiraju Conventions - Elegant banquet hall with chandeliers and round tables"
                  />
                  <div className={styles.imageBadge}>
                    <p>Convention Hall</p>
                  </div>
                </div>
                {/* Two smaller images showing different event setups */}
                <div className={styles.smallConventionImage}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={IMAGES.wedding}
                    alt="Wedding celebration with beautiful decor at Buchiraju Conventions"
                  />
                </div>
                <div className={styles.smallConventionImage}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={IMAGES.conference}
                    alt="Corporate conference with modern AV setup and professional seating"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Feedback & Stories */}
        {/* Client Feedback & Stories */}
        <section className={`${styles.testimonialsSection} animate-slide-up`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.heading}>Client Feedback & Stories</h2>
            <p className={styles.description}>
              Hear what our valued guests have to say about their experiences at Hotel The Retinue
            </p>
          </div>

          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.rating}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className={styles.quote}>"{t.quote}"</p>
                <div className={styles.author}>
                  <div className={styles.avatar}>{t.name.charAt(0)}</div>
                  <div className={styles.authorInfo}>
                    <p className={styles.authorName}>{t.name}</p>
                    <p className={styles.authorRole}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact & CTA Footer */}
        {/* Contact & CTA Footer */}
        <section className={`${styles.footerSection} animate-slide-up`}>
          <div className={styles.footerContainer}>
            <div className={styles.footerGrid}>
              {/* Contact Info */}
              <div className={styles.footerColumn}>
                <h3 className={styles.footerHeading}>Contact</h3>
                <div className={styles.footerLinks}>
                  <p>
                    <a href={`tel:${HOTEL.phone}`}>{HOTEL.phoneDisplay}</a>
                  </p>
                  <p>
                    <a href={`mailto:${HOTEL.email}`}>{HOTEL.email}</a>
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className={styles.footerColumn}>
                <h3 className={styles.footerHeading}>Address</h3>
                <div className={styles.footerLinks}>
                  <p>
                    {HOTEL.shortAddress}
                    <br />
                    {HOTEL.landmark}
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className={styles.footerColumn}>
                <h3 className={styles.footerHeading}>Quick Links</h3>
                <div className={styles.footerLinks}>
                  <Link href="/rooms">Our Rooms</Link>
                  <Link href="/conventions">Conventions</Link>
                  <Link href="/blog">Blog</Link>
                  <Link href="/contact">Contact Us</Link>
                </div>
              </div>

              {/* CTA */}
              <div className={styles.footerColumn}>
                <h3 className={styles.footerHeading}>Get Started</h3>
                <div className={styles.footerButtons}>
                  <Link href="/book" className={`${styles.footerButton} ${styles.primary} animate-shimmer`}>
                    Book a Room
                  </Link>
                  <Link href="/signup" className={`${styles.footerButton} ${styles.secondary}`}>
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className={styles.copyright}>
              <p>
                © {new Date().getFullYear()} Hotel The Retinue & Buchiraju Conventions. All rights reserved.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
