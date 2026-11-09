import { useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { Arrow, Roll, type Dir } from "@/components/DoctorShowcase";
import { useRevealOnce } from "@/components/Highlights";
import { SwapText } from "@/components/HeroHeader";

export type Review = { id: number; name: string; role: string; content: string; rating: number; sample?: boolean };

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

  return (
    <section ref={ref} id="reviews" className="rv dark-sec" aria-roledescription="carousel" aria-labelledby="reviews-title">
      <div className="dark-inner rv-grid">
        <div className="rv-intro">
          <p className="dark-caption dark-rise">(Կարծիքներ)</p>
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

        <figure className="rv-quote dark-rise" aria-live="polite">
          <blockquote><p><Roll text={`«${review.content}»`} dir={dir} byWord delay={60} /></p></blockquote>
          <figcaption>
            <span className="rv-name"><Roll text={review.name} dir={dir} />{review.sample && <span className="rv-sample">{sampleLabel}</span>}</span>
            <span className="rv-role"><Roll text={review.role} dir={dir} delay={40} /></span>
          </figcaption>
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
