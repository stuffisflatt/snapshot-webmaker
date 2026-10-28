import heroAv1 from "@/assets/hero.av1.mp4.asset.json";
import heroMp4 from "@/assets/hero.mp4.asset.json";
import { useEffect, useRef } from "react";
import { ArrowUpRight, CalendarCheck, Phone } from "lucide-react";
import { CLINIC } from "@/lib/clinic";
import { HeroDots } from "./HeroDots";

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
    <section ref={hero} className="clinic-hero" aria-labelledby="clinic-hero-title">
      <HeroDots containerRef={hero} />
      <div className="clinic-hero-film" aria-hidden="true">
        <video ref={video} autoPlay muted loop playsInline preload="auto" poster="/media/hero-poster.webp" disablePictureInPicture>
          {/* AV1 carries the film grain as synthesis parameters; H.264 keeps it in the pixels. */}
          <source src={heroAv1.url} type='video/mp4; codecs="av01.0.08M.08"' />
          <source src={heroMp4.url} type="video/mp4" />
        </video>
      </div>



      <h1 id="clinic-hero-title" className="clinic-headline"><span className="hl-row"><span className="hl-left"><b className="swash">A</b>lph</span><span className="hl-right">astom<span className="clinic-headline-sub">Dental Clinic</span></span></span></h1>
      <div className="clinic-headline clinic-headline-light" aria-hidden="true"><span className="hl-row"><span className="hl-left"><b className="swash">A</b>lph</span><span className="hl-right">astom<span className="clinic-headline-sub">Dental Clinic</span></span></span></div>

      <a className="clinic-location" href={CLINIC.yandex} target="_blank" rel="noopener noreferrer"><span>Մեր հասցեն</span><strong>Երևան, Կենտրոն<br />Պռոշյան 28/2</strong><small>Ձեր կողքին՝ 2002 թվականից <ArrowUpRight size={14} /></small></a>
      <div className="clinic-hero-ctas">
        <button className="clinic-hero-cta clinic-hero-cta-book" onClick={onBook}><CalendarCheck size={21} /><span>Ամրագրել այցը</span><ArrowUpRight size={21} /></button>
        <a className="clinic-hero-cta clinic-hero-cta-call" href={CLINIC.mobileHref}><Phone size={21} /><span>Զանգահարել</span><ArrowUpRight size={21} /></a>
      </div>
      <p className="clinic-hero-note">Բազմապրոֆիլ<br />ստոմատոլոգիական կենտրոն<br />Երևանում՝ 2002 թվականից։</p>
    </section>
    </>
  );
}
