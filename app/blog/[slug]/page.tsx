import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";

type Props = { params: Promise<{ slug: string }> };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen app-shell">
      <header className="app-header border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-100">
            Hotel The Retinue & Buchiraju Conventions
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/book"
              className="text-slate-400 hover:text-[var(--accent)] transition-colors"
            >
              Book a room
            </Link>
            <Link
              href="/my-booking"
              className="text-slate-400 hover:text-[var(--accent)] transition-colors"
            >
              View my booking
            </Link>
            <Link
              href="/blog"
              className="text-sky-400 font-medium"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/blog"
          className="text-sm text-[var(--accent)] hover:underline mb-6 inline-block"
        >
          ← Back to blog
        </Link>
        <article className="card p-6 md:p-8">
          <p className="text-slate-500 text-sm mb-2">
            {formatDate(post.date)}
            {post.author && ` · ${post.author}`}
          </p>
          <h1 className="text-2xl font-bold text-slate-100 mb-4">
            {post.title}
          </h1>
          <p className="text-slate-400 leading-relaxed">{post.excerpt}</p>
        </article>
      </main>
    </div>
  );
}
