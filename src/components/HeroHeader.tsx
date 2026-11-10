import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, CalendarCheck, Phone } from "lucide-react";
import { CLINIC } from "@/lib/clinic";
import { HeroDots } from "./HeroDots";
import { ShaderBackground } from "@/components/ui/7777";
import NavHeader from "@/components/ui/nav-header";

function SwapLine({ text }: { text: string }) {
  return <span className="swap-line" aria-hidden="true">{[...text].map((char, i) => <span key={i} className="swap-char" style={{ "--i": i } as CSSProperties}>{char}</span>)}</span>;
}

export function SwapText({ text, hover }: { text: string; hover: string }) {
  return <span className="swap"><span className="sr-only">{text}</span><SwapLine text={text} /><SwapLine text={hover} /></span>;
}

const TAGLINES = ["Ժպտա՛ վստահ", "Ցավդ՝ առաջնահերթ", "Նուրբ աշխատանք", "Ազնիվ պայմաններ"];

// The outgoing line rolls up and out, then resets below once settled, so every change moves upward.
function RotatingTagline() {
  const [active, setActive] = useState(0);
  const [settled, setSettled] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let reset: number;
    const timer = window.setInterval(() => {
      setSettled(false);
      setActive(current => (current + 1) % TAGLINES.length);
      reset = window.setTimeout(() => setSettled(true), 900);
    }, 3200);
    return () => { window.clearInterval(timer); window.clearTimeout(reset); };
  }, []);

  return (
    <p className="tagline-rotator">
      <span className="sr-only">{TAGLINES.join(". ")}</span>
      {TAGLINES.map((line, index) => (
        <span key={line} className="tagline-line" aria-hidden="true" data-state={index === active ? "in" : !settled && index === (active + TAGLINES.length - 1) % TAGLINES.length ? "out" : "below"}>
          {(line.match(/.՛?/gu) ?? []).map((char, i) => <span key={i} className="tagline-char" style={{ "--i": i } as CSSProperties}>{char}</span>)}
        </span>
      ))}
    </p>
  );
}

export function HeroHeader({ onBook }: { onBook: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const hero = useRef<HTMLElement>(null);

  useEffect(() => {
    let inView = true;
    const resume = () => {
      if (!document.hidden && inView && video.current) {
        video.current.muted = true;
        void video.current.play().catch(() => {});
      }
    };
    resume();
    const observer = new IntersectionObserver(entries => {
      inView = entries[0]?.isIntersecting ?? false;
      if (inView) resume(); else video.current?.pause();
    }, { rootMargin: "100px" });
    if (video.current) observer.observe(video.current);
    document.addEventListener("visibilitychange", resume);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", resume); };
  }, []);

  return (
    <>
    <NavHeader onBook={onBook} />
    <section ref={hero} className="clinic-hero" aria-labelledby="clinic-hero-title">
      <div className="clinic-hero-shader" aria-hidden="true"><ShaderBackground /></div>
      <HeroDots containerRef={hero} />
      <div className="clinic-hero-film" aria-hidden="true">
        <video ref={video} autoPlay muted loop playsInline preload="auto" poster="/media/hero-poster.webp" disablePictureInPicture>
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      </div>



      <h1 id="clinic-hero-title" className="clinic-headline"><span className="hl-row"><span className="hl-left"><b className="swash">A</b>lph</span><span className="hl-right">astom<span className="clinic-headline-sub">Dental Clinic</span></span></span></h1>
      <div className="clinic-headline clinic-headline-light" aria-hidden="true"><span className="hl-row"><span className="hl-left"><b className="swash">A</b>lph</span><span className="hl-right">astom<span className="clinic-headline-sub">Dental Clinic</span></span></span></div>
      <div className="clinic-headline clinic-headline-light clinic-headline-tint" aria-hidden="true"><span className="hl-row"><span className="hl-left"><b className="swash">A</b>lph</span><span className="hl-right">astom<span className="clinic-headline-sub">Dental Clinic</span></span></span></div>

      <div className="clinic-hero-tagline"><div className="clinic-hero-rating" role="img" aria-label="5 stars on Google, 147+ reviews"><span aria-hidden="true">★★★★★</span><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.35 11.1h-9.17v2.98h5.27c-.48 2.5-2.6 3.92-5.27 3.92a6 6 0 1 1 3.93-10.53l2.23-2.23A9.1 9.1 0 1 0 12.18 21c5.25 0 9.46-3.8 9.46-9 0-.3-.1-.6-.29-.9z"/></svg><span>147+ reviews</span></div><ul><li>25+ տարի փորձ</li><li>Բազմապրոֆիլ հոգատար թիմ</li></ul><RotatingTagline /></div>

      <a className="clinic-location" href={CLINIC.yandex} target="_blank" rel="noopener noreferrer"><span>Մեր հասցեն</span><strong>Երևան, Կենտրոն<br />Պռոշյան 28/2</strong><small>Ձեր կողքին՝ 2002 թվականից <ArrowUpRight size={14} /></small></a>
      <div className="clinic-hero-ctas">
        <button className="clinic-hero-cta clinic-hero-cta-book" onClick={onBook}><CalendarCheck size={21} /><SwapText text="Ամրագրել այցը" hover="Ընտրել ժամը" /><ArrowUpRight size={21} /></button>
        <a className="clinic-hero-cta clinic-hero-cta-call" href="#contact"><Phone size={21} /><SwapText text="Կապ մեզ հետ" hover="Գրել կամ զանգել" /><ArrowUpRight size={21} /></a>
      </div>
    </section>
    </>
  );
}
