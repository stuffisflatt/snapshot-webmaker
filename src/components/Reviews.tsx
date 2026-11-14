import { useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { Arrow, Roll, type Dir } from "@/components/DoctorShowcase";
import { useRevealOnce } from "@/components/Highlights";
import { SwapText } from "@/components/HeroHeader";
import { useSwipe } from "@/components/useSwipe";

/** source "google" shows the Google mark; use it only for reviews actually copied from Google. */
export type Review = { id: number; name: string; role: string; content: string; rating: number; sample?: boolean; source?: "google" };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Patient reviews in the doctors section's language: the quote, name and treatment roll out and
 * in when stepping through, with the same round arrows and counter.
 */
export function Reviews({ reviews, rating, ratingCount, ratingHref, sampleLabel }: {
  reviews: Review[]; rating: string; ratingCount: number | string; ratingHref: string; sampleLabel: string;
}) {
  const ref = useRevealOnce<HTMLElement>();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<Dir>("next");
  const review = reviews[index]!;
  const last = reviews.length - 1;
  const go = (to: number) => {
    if (to < 0 || to > last || to === index) return;
    setDir(to > index ? "next" : "prev");
    setIndex(to);
  };
  const swipe = useSwipe(step => go(index + step));

  return (
    <section ref={ref} id="reviews" className="rv dark-sec" aria-roledescription="carousel" aria-labelledby="reviews-title">
      <div className="dark-inner rv-grid">
        <div className="rv-intro">
          <p className="rv-mark dark-rise" aria-hidden="true">“</p>
          <h2 id="reviews-title" className="dark-title dark-rise">Ինչ են ասում <span className="dark-title-serif">պացիենտները</span></h2>
          <a className="rv-rating dark-rise" href={ratingHref} target="_blank" rel="noopener noreferrer">
            <span className="rv-score">{rating}</span>
            <span className="rv-stars" aria-label={`5-ից ${rating} աստղ`}>{[0, 1, 2, 3, 4].map(i => <Star key={i} />)}</span>
            <span className="rv-count">{ratingCount} կարծիք</span>
          </a>
          <a className="clinic-hero-cta clinic-hero-cta-call rv-cta dark-rise" href={ratingHref} target="_blank" rel="noopener noreferrer">
            <SwapText text="Կարդալ բոլորը" hover="Բացել քարտեզում" /><ArrowUpRight />
          </a>
        </div>

        <figure className="rv-quote rv-card dark-rise" aria-live="polite" {...swipe}>
          <figcaption className="rv-head">
            <span className="rv-avatar" aria-hidden="true">{review.name.charAt(0)}</span>
            <span className="rv-who">
              <span className="rv-name"><Roll text={review.name} dir={dir} />{review.sample && <span className="rv-sample">{sampleLabel}</span>}</span>
              <span className="rv-role"><Roll text={review.role} dir={dir} delay={40} /></span>
            </span>
          </figcaption>
          {review.source === "google" && !review.sample && <svg className="rv-google" viewBox="0 0 48 48" role="img" aria-label="Google"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>}
          <span className="rv-card-stars" aria-label={`${review.rating} / 5`}>{Array.from({ length: review.rating }, (_, i) => <Star key={i} />)}</span>
          {/* Every review sits in the same cell, the others invisible, so the card is always as tall
              as the longest one and the arrows and counter below never move. */}
          <div className="rv-text-stack">
            <blockquote><p><Roll text={review.content} dir={dir} byWord delay={60} /></p></blockquote>
            {reviews.map(r => <blockquote key={r.id} className="rv-ghost" aria-hidden="true"><p>{r.content}</p></blockquote>)}
          </div>
        </figure>

        <div className="rv-foot dark-rise">
          <p className="doc-count"><Roll text={pad(index + 1)} dir={dir} />/{pad(reviews.length)}</p>
          <div className="doc-nav">
            <button type="button" className="doc-arrow doc-prev" onClick={() => go(index - 1)} aria-label="Նախորդ կարծիքը" data-shown={index > 0} disabled={index === 0}>
              <span className="doc-next-arrows"><Arrow /><Arrow /></span>
            </button>
            <button type="button" className="doc-arrow doc-next" onClick={() => go(index + 1)} aria-label="Հաջորդ կարծիքը" data-shown={index < last} disabled={index === last}>
              <span className="doc-next-arrows"><Arrow /><Arrow /></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
