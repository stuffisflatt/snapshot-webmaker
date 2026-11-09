import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowUpRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SwapText } from "@/components/HeroHeader";

// Sample copy and placeholder photos: confirm the wording with the clinic and swap in its own pictures.
const ITEMS = [
  { title: "2002 թվականից", text: "Քսան տարուց ավելի խնամում ենք երևանցիների ժպիտները։", photo: "/media/clinic/door.webp" },
  { title: "Առանց շտապելու", text: "Ամեն քայլ բացատրում ենք մինչև բուժումը սկսելը։", photo: "/media/clinic/waiting.webp" },
  { title: "Ամեն ինչ մեկ վայրում", text: "Հիգիենայից մինչև իմպլանտ՝ նույն կլինիկայում։", photo: "/media/clinic/reception.webp" },
  { title: "Ժամանակակից կաբինետներ", text: "Ճշգրիտ ախտորոշում և հարմարավետ բուժում։", photo: "/media/clinic/treatment.webp" },
];

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

export function Highlights({ onBook }: { onBook: () => void }) {
  const ref = useRevealOnce<HTMLElement>();
  return (
    <section ref={ref} id="why" className="hl dark-sec" aria-labelledby="why-title">
      <div className="dark-inner">
        <header className="dark-head">
          <div>
            <p className="dark-caption dark-rise">(Ինչու մենք)</p>
            <h2 id="why-title" className="dark-title dark-rise"><span className="dark-title-serif">Ինչու՞</span> Ալֆաստոմ</h2>
          </div>
          <div className="dark-head-side dark-rise">
            <p className="dark-lede">Արդեն քսան տարի մարդիկ մեզ են վստահում իրենց ժպիտը։</p>
            <Button variant="ghost" className="clinic-hero-cta clinic-hero-cta-book" onClick={onBook}>
              <CalendarCheck /><SwapText text="Ամրագրել այցը" hover="Ընտրել ժամը" /><ArrowUpRight />
            </Button>
          </div>
        </header>
        <ul className="hl-grid">
          {ITEMS.map((item, i) => (
            <li key={item.title} className="hl-card dark-rise" style={{ "--i": i } as CSSProperties}>
              <figure className="hl-photo"><img src={item.photo} alt="" width={600} height={750} loading="lazy" decoding="async" /></figure>
              <p className="hl-num">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="hl-title">{item.title}</h3>
              <p className="hl-text">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
