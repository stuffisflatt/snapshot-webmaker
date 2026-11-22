import { useEffect, useRef, type ReactNode } from "react";
import { ShaderBackground } from "@/components/ui/7777";

type RGB = [number, number, number];

// Near-black greys with the story section's two reds; the second red leans a touch toward orange.
const MESH_COLORS: RGB[] = [[.1, .1, .105], [.055, .055, .06], [.1, .1, .105], [.69, .33, .3], [.84, .45, .3], [0, 0, 0], [0, 0, 0], [0, 0, 0]];

/** Where the red sits at the top of the first section, and where it has travelled by the end of the second. */
const FROM: [number, number] = [-.3, .35];
const TO: [number, number] = [.45, -.5];
/** How quickly the background catches up with the scroll position (per second); critically damped. */
const FOLLOW = 5;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/**
 * One pinned dark mesh behind the sections it wraps. As the visitor scrolls through them, the red
 * glides from one corner to the other a beat behind the scroll, so it carries across the seam
 * between the sections instead of restarting in each one. desktopTravelFrom (a selector) starts that
 * glide at a later section on desktop, where the sections before it cover the mesh with their own photo.
 */
export function DarkBackdrop({ children, desktopTravelFrom }: { children: ReactNode; desktopTravelFrom?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const offset = useRef<[number, number]>([...FROM]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, last = 0, bg = -1;

    const frame = (now: number) => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const from = desktopTravelFrom && window.innerWidth >= 768 ? el.querySelector(desktopTravelFrom) : null;
      const top = from ? from.getBoundingClientRect().top : box.top;
      const travel = Math.max(1, box.bottom - top - window.innerHeight);
      const target = smoother(clamp01(-top / travel));
      const dt = last ? Math.min(.1, (now - last) / 1000) : 1;
      last = now;
      bg = bg < 0 || reduced.matches ? target : bg + (target - bg) * (1 - Math.exp(-FOLLOW * dt));
      if (Math.abs(target - bg) < .0005) bg = target;
      offset.current = [FROM[0] + (TO[0] - FROM[0]) * bg, FROM[1] + (TO[1] - FROM[1]) * bg];
      if (bg !== target) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(frame); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [desktopTravelFrom]);

  return (
    <div ref={root} className="dark-backdrop">
      <div className="dark-backdrop-layer" aria-hidden="true">
        <div className="dark-backdrop-pin"><ShaderBackground colors={MESH_COLORS} offsetRef={offset} /></div>
      </div>
      {children}
    </div>
  );
}
