"use client";

import { useState } from "react";
import Link from "next/link";
import { blogPosts, type BlogPost } from "@/lib/blog-data";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen app-shell">
      <header className="app-header border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-100">
            Hotel The Retinue
          </Link>
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
              href="/signup"
              className="text-slate-300 hover:text-sky-400 transition-colors"
            >
              Sign up
            </Link>
            <span className="text-sky-400 font-medium">Blog</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Sign up card - same style as sign-in form */}
        <div className="card p-6 max-w-md mx-auto mb-10">
          <h2 className="card-header text-xl font-semibold text-slate-100">
            Sign up for updates
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            Get the latest news and offers from Hotel The Retinue.
          </p>
          {submitted ? (
            <p className="text-emerald-400 text-sm py-2">
              Thanks! We&apos;ll keep you updated.
            </p>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="form-label">Name (optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="btn-primary w-full py-3">
                Sign up
              </button>
            </form>
          )}
        </div>

        {/* Blog list - cards in same style */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Latest posts</h3>
          <p className="text-slate-400 text-sm">Stories and updates from The Retinue.</p>
        </div>
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card p-5 block hover:border-sky-500/30 transition-colors"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-slate-100 font-semibold mb-1">{post.title}</h4>
          <p className="text-slate-400 text-sm line-clamp-2">{post.excerpt}</p>
          <p className="text-slate-500 text-xs mt-2">
            {formatDate(post.date)}
            {post.author && ` · ${post.author}`}
          </p>
        </div>
        <span className="text-sky-400 shrink-0" aria-hidden>
          →
        </span>
      </div>
    </Link>
  );
}
