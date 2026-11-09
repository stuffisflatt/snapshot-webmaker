import { useEffect, useRef, type ReactNode } from "react";
import { ShaderBackground } from "@/components/ui/7777";

type RGB = [number, number, number];

// Light and mid grey with soft reds; the reds sit in the same slots as the hero mesh skin tones, so they travel the same paths.
const MESH_COLORS: RGB[] = [[.79, .79, .8], [.56, .56, .57], [.79, .79, .8], [.69, .33, .3], [.77, .41, .36], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
/** The same mesh once the doctors section has arrived: greys lifted to an almost-white, reds untouched. */
const MESH_LIGHT: RGB[] = [[.97, .97, .975], [.9, .9, .91], [.97, .97, .975], [.69, .33, .3], [.77, .41, .36], [0, 0, 0], [0, 0, 0], [0, 0, 0]];

/** Where the red has travelled once the doctors section fills the screen: up and to the left, still fully on screen. */
const DRIFT: [number, number] = [.5, -.55];
/** How quickly the background catches up with the scroll position (per second); critically damped, so it never overshoots. */
const FOLLOW = 5;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));
/** Zero speed at both ends: motion-graphic ease for the hand-over. */
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
/** Strong ease-out (cubic-bezier .23,1,.32,1 in spirit) for the incoming section. */
const easeOut = (t: number) => 1 - (1 - t) ** 4;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * One pinned mesh behind the story and doctors sections. As the doctors section rises, the story
 * content lifts away and fades while the doctors content settles in, all tied to scroll position.
 * The background follows a beat behind: the red glides to the opposite corner, the greys lighten
 * toward white and the white top fades out. Scrolling back plays everything in reverse.
 */
export function StoryBackdrop({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const offset = useRef<[number, number]>([0, 0]);
  const colors = useRef<RGB[]>(MESH_COLORS.map(c => [...c] as RGB));

  useEffect(() => {
    const el = root.current;
    const doctors = el?.querySelector<HTMLElement>("#doctors");
    const leaving = el?.querySelector<HTMLElement>(".sx-grid");
    const arriving = doctors?.querySelector<HTMLElement>(".doc-grid");
    const button = doctors?.querySelector<HTMLElement>(".doc-nav");
    if (!el || !doctors) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, last = 0, bg = 0;

    const frame = (now: number) => {
      raf = 0;
      const still = reduced.matches;
      const progress = clamp01(1 - doctors.getBoundingClientRect().top / window.innerHeight);
      const vh = window.innerHeight / 100;

      // Story content lifts away and shrinks a touch while the doctors section is still low on screen.
      const out = smoother(seg(progress, 0, .7));
      if (leaving) {
        leaving.style.opacity = String(1 - out);
        leaving.style.transform = still ? "" : `translate3d(0, ${-12 * vh * out}px, 0) scale(${1 - .08 * out})`;
      }
      // Doctors content rises the last stretch and settles, starting once the story has mostly gone.
      const enter = easeOut(seg(progress, .25, 1));
      if (arriving) {
        arriving.style.opacity = String(enter);
        arriving.style.transform = still ? "" : `translate3d(0, ${8 * vh * (1 - enter)}px, 0) scale(${.96 + .04 * enter})`;
      }
      if (button) {
        button.style.opacity = String(enter);
        button.style.translate = still ? "" : `0 ${10 * vh * (1 - enter)}px`;
      }

      // The background trails the scroll: frame-rate independent, critically damped follow.
      const target = smoother(progress);
      const dt = last ? Math.min(.1, (now - last) / 1000) : 1;
      last = now;
      bg = still ? target : bg + (target - bg) * (1 - Math.exp(-FOLLOW * dt));
      if (Math.abs(target - bg) < .0005) bg = target;
      offset.current = [DRIFT[0] * bg, DRIFT[1] * bg];
      colors.current = MESH_COLORS.map((c, i) => c.map((v, j) => mix(v, MESH_LIGHT[i]![j]!, bg)) as RGB);
      el.style.setProperty("--story-white", String(1 - bg));

      if (bg !== target) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(frame); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <div ref={root} className="story-backdrop">
      <div className="story-backdrop-layer" aria-hidden="true">
        <div className="story-backdrop-pin"><ShaderBackground colors={MESH_COLORS} offsetRef={offset} colorsRef={colors} /></div>
      </div>
      {children}
    </div>
  );
}
