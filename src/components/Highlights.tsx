import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SwapText } from "@/components/HeroHeader";

// Placeholder photos: swap in the clinic's own before/after pairs (with patient consent).
const PHOTOS = ["/media/clinic/door.webp", "/media/clinic/waiting.webp", "/media/clinic/reception.webp", "/media/clinic/treatment.webp"];

/** Adds data-in once the element is a fifth of the way into view, so its children can rise in. */
export function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { el.dataset["in"] = "true"; io.disconnect(); }
    }, { threshold: .2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Results: a 2×2 grid of before/after photos on the left, the story of the results on the right. */
export function Highlights({ onBook }: { onBook: () => void }) {
  const ref = useRevealOnce<HTMLElement>();
  return (
    <section ref={ref} id="results" className="hl dark-sec" aria-labelledby="results-title">
      <div className="dark-inner hl-layout">
        <ul className="hl-grid" aria-label="Արդյունքների օրինակներ">
          {PHOTOS.map((photo, i) => (
            <li key={photo} className="hl-card dark-rise" style={{ "--i": i } as CSSProperties}>
              <figure className="hl-photo"><img src={photo} alt="" width={600} height={750} loading="lazy" decoding="async" /></figure>
            </li>
          ))}
        </ul>
        <div className="hl-copy">
          <p className="dark-caption dark-rise" style={{ "--i": 1 } as CSSProperties}>(Արդյունքներ)</p>
          <h2 id="results-title" className="dark-title dark-rise" style={{ "--i": 2 } as CSSProperties}>Ժպիտներ՝ <span className="dark-title-serif">առաջ և հետո</span></h2>
          <p className="dark-lede dark-rise" style={{ "--i": 3 } as CSSProperties}>Յուրաքանչյուր արդյունք սկսվել է մեկ հանգիստ խորհրդատվությունից։ Տեսեք, թե ինչ է փոխում մանրակրկիտ աշխատանքը։</p>
          <Button variant="ghost" className="clinic-hero-cta clinic-hero-cta-book dark-rise" style={{ "--i": 4 } as CSSProperties} onClick={onBook}>
            <SwapText text="Սկսել խորհրդատվությունից" hover="Ընտրել ժամը" /><ArrowUpRight />
          </Button>
        </div>
      </div>
    </section>
  );
}
