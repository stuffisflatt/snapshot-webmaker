import { useEffect, useRef, useState } from "react";
import { storyScrollDelta } from "@/lib/story-scroll";
import { activeStep, CORNER, frameTab, photoRise, sceneProgress, stepLine, videoFrame } from "@/lib/story-motion";

const STEPS = [
  { t: "Մանրակրկիտ զննում", d: "Սկսում ենք ձեր ատամների և խնդրի ուշադիր գնահատումից։", tags: ["Զննում", "Ռենտգեն", "Խորհրդատվություն"] },
  { t: "Անհատական բուժման պլան", d: "Բժիշկը բացատրում է տարբերակները և քայլերը՝ պարզ լեզվով։", tags: ["Բուժման պլան", "Տարբերակներ", "Արժեքի հաշվարկ"] },
  { t: "Հաջորդ քայլերը՝ ձեր բժշկի հետ", d: "Միասին որոշում եք, թե երբ և ինչպես շարունակել։", tags: ["Այցերի ժամանակացույց", "Հսկողություն"] },
];

// Stills cut from the walkthrough film; replace with real clinic photos when available.
const PHOTOS = [
  { src: "/media/clinic/waiting.webp", alt: "Սպասասրահ" },
  { src: "/media/clinic/door.webp", alt: "Բուժասենյակի մուտք" },
  { src: "/media/clinic/treatment.webp", alt: "Բուժասենյակ" },
];

// The scrubbed video is encoded with a keyframe every few frames so any scroll
// position decodes at once. Phones get a narrower crop of the same footage.
export function StoryScroll({ videoSrc, phoneVideoSrc, posterSrc }: { videoSrc?: string; phoneVideoSrc?: string; posterSrc?: string }) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState(false);
  const [blobSrc, setBlobSrc] = useState<string>();
  const src = phone && phoneVideoSrc ? phoneVideoSrc : videoSrc;
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setPhone(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  // Download the whole file before scrubbing: seeking inside a blob never waits
  // on a network range request. Starts about a screen and a half before the section.
  useEffect(() => {
    const section = ref.current;
    if (!src || !section) return;
    let url: string | undefined, cancelled = false;
    const controller = new AbortController();
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting) return;
      observer.disconnect();
      fetch(src, { signal: controller.signal }).then(r => r.blob()).then(blob => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setBlobSrc(url);
      }).catch(() => { if (!cancelled) setBlobSrc(src); });
    }, { rootMargin: "150% 0px" });
    observer.observe(section);
    return () => {
      cancelled = true; observer.disconnect(); controller.abort();
      if (url) URL.revokeObjectURL(url);
      setBlobSrc(undefined);
    };
  }, [src]);
  useEffect(() => {
    setStep(0);
    const section = ref.current;
    if (!section) return;
    const video = videoRef.current;
    const photos = [...section.querySelectorAll<HTMLElement>(".sx-photo")];
    const lines = [...section.querySelectorAll<HTMLElement>(".sx-step")].map(s => [...s.querySelectorAll<HTMLElement>(".sx-line > *")]);
    const shade = section.querySelector<HTMLElement>(".sx-shade");
    const frame = section.querySelector<HTMLElement>(".sx-video");
    const ext = section.querySelector<HTMLElement>(".sx-ext");
    const fillet = section.querySelector<HTMLElement>(".sx-fillet");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, target = 0, currentStep = 0;
    let visible = false, disposed = false;
    const storyRect = () => section.getBoundingClientRect();
    const scrollMetrics = () => ({ range: Math.max(1, section.offsetHeight - window.innerHeight) });
    // Keep only the latest seek target. A slow decoder can never queue old seeks
    // or block the motion, scrolling, or leaving this section.
    const syncVideo = () => {
      if (!video || video.seeking || !visible || !Number.isFinite(video.duration) || video.duration <= 0) return;
      // Map the whole scroll range onto the whole clip, last frame included.
      // Reduced motion swaps the walk-through for one still per step.
      const end = Math.max(0, video.duration - 1 / 24);
      const time = reduced.matches ? ([0, .5, 1][currentStep] ?? 0) * end : target * end;
      if (Math.abs(video.currentTime - time) >= 1 / 48) video.currentTime = time;
    };
    const schedule = () => { if (!raf && visible && !disposed) raf = requestAnimationFrame(render); };
    function render() {
      raf = 0;
      if (disposed || !visible || !section) return;
      const p = sceneProgress(target), still = reduced.matches;
      // Stable grid: only the frame moves and resizes, exactly at scroll progress.
      if (frame) {
        const pose = videoFrame(still ? .25 : target);
        const media = frame.parentElement;
        const stage = section.querySelector<HTMLElement>(".sx-stage");
        if (media && stage) {
          const baseWidth = media.offsetWidth;
          const scale = phone ? 1 + (pose.scale - 1) * .2 : pose.scale;
          const width = Math.min(baseWidth * scale, window.innerWidth - 40, Math.max(180, window.innerHeight - 190) * pose.aspect);
          const mediaRect = media.getBoundingClientRect();
          const stageRect = stage.getBoundingClientRect();
          const x = (stageRect.left + stageRect.width / 2 - mediaRect.left - width / 2) * pose.center;
          const height = (width - 18) / pose.aspect + 18;
          const y = (stageRect.top + stageRect.height / 2 - mediaRect.top - height / 2) * pose.center;
          frame.style.width = `${width}px`;
          frame.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          section.style.setProperty("--sx-ar", String(pose.aspect));
        }
      }
      // Photos travel up from below the screen into the row under the video; transform
      // and opacity only, so the fixed video and text never re-lay out.
      const travel = window.innerHeight;
      photos.forEach((photo, i) => {
        const r = photoRise(photos.length - 1 - i, p, still);
        photo.style.opacity = String(r.opacity);
        photo.style.transform = `translate3d(0, ${r.y * travel}px, 0) scale(${r.scaleX}, ${r.scaleY})`;
      });
      // The shade drifts left to right and dips low mid-way, following the walk-through.
      if (shade && !still) shade.style.transform = `translate3d(${(p - .5) * 10}vw, ${Math.sin(p * Math.PI) * 5}vh, 0)`;
      // One frame deforms: it pours down under the rightmost photo, then stretches left across
      // the others in arrival order. Each stretch overshoots a touch and settles (frameTab).
      if (ext) {
        const W = ext.offsetWidth, H = ext.offsetHeight, n = photos.length;
        const starts = photos.map(ph => ph.offsetLeft);
        const grown = photos.map((_, i) => frameTab(n - 1 - i, p, still));
        // The pour starts at the last photo's full width and only grows in height.
        let left = starts[n - 1] ?? W;
        for (let i = n - 2; i >= 0; i--) left -= ((starts[i + 1] ?? 0) - (starts[i] ?? 0)) * (grown[i] ?? 0);
        left = Math.max(0, left);
        const height = H * Math.min(1, grown[n - 1] ?? 0);
        ext.style.clipPath = height > 0
          ? `inset(0 0 ${H - height}px ${left}px round 0 0 ${CORNER}px ${CORNER}px)`
          : "inset(0 100% 100% 0)";
        // Where the frame turns back under the video, an inner fillet rounds the corner the
        // same 12px as every outer corner, so the outline reads as one shape.
        if (fillet) {
          const shown = height > CORNER && left > CORNER;
          fillet.style.opacity = shown ? "1" : "0";
          fillet.style.transform = `translate3d(${left - CORNER}px, 0, 0)`;
        }
        // The video's bottom corners straighten exactly as far as the white has flowed past
        // them: the right one by the pour's depth, the left one as the stretch reaches it.
        if (frame) frame.style.borderRadius = `${CORNER}px ${CORNER}px ${Math.max(0, CORNER - height)}px ${Math.min(CORNER, left)}px`;
      }
      // Step text: each line slides within its own mask, by a share of its own height.
      lines.forEach((stepLines, s) => stepLines.forEach((el, l) => {
        const line = stepLine(s, l, p, still);
        el.style.opacity = String(line.opacity);
        el.style.transform = `translate3d(0, ${line.y * 100}%, 0) scaleY(${line.scaleY})`;
      }));
      const nextStep = activeStep(p);
      if (nextStep !== currentStep) { currentStep = nextStep; setStep(nextStep); }
      syncVideo();
    }
    const update = () => {
      target = Math.min(1, Math.max(0, -storyRect().top / scrollMetrics().range));
      schedule();
    };
    // The browser owns scrolling. Only oversized wheel input is bounded;
    // visual easing never moves the page or waits for a decoded frame.
    const onScroll = () => update();
    const onWheel = (event: WheelEvent) => {
      if (!event.cancelable || event.ctrlKey || event.metaKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable=true], [role=dialog]')) return;
      const y = window.scrollY;
      const start = y + storyRect().top;
      const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      const allowed = storyScrollDelta(y, pixels, start, start + scrollMetrics().range, window.innerHeight);
      if (allowed !== pixels) {
        event.preventDefault();
        window.scrollBy({ top: allowed, behavior: "instant" });
      }
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
      if (visible) update();
      else { cancelAnimationFrame(raf); raf = 0; }
    }, { rootMargin: "300px" });
    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", update);
    reduced.addEventListener("change", update);
    video?.addEventListener("loadedmetadata", syncVideo);
    video?.addEventListener("seeked", syncVideo);
    update();
    return () => {
      disposed = true; observer.disconnect(); cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", update);
      window.removeEventListener("wheel", onWheel);
      reduced.removeEventListener("change", update);
      video?.removeEventListener("loadedmetadata", syncVideo);
      video?.removeEventListener("seeked", syncVideo);
    };
  }, [phone, blobSrc]);

  return (
    <section ref={ref} id="how" aria-label="Ինչպես ենք աշխատում" className="sx" data-step={step}>
      <div className="sx-stage">
        <div className="sx-shade" aria-hidden="true" />
        <div className="sx-grid">
          <div className="sx-media">
            <div className="sx-video">
              {src && <video ref={videoRef} src={blobSrc} poster={posterSrc} muted playsInline preload="auto" aria-hidden="true" disablePictureInPicture />}
            </div>
          </div>
          <div className="sx-text">
            <div className="sx-steps">
              {STEPS.map((s, i) => (
                <div key={i} className="sx-step" aria-hidden={i !== step}>
                  <div className="sx-line"><span className="sx-num">{String(i + 1).padStart(2, "0")}</span></div>
                  <div className="sx-line"><h2 className="sx-title">{s.t}</h2></div>
                  <div className="sx-line"><p className="sx-desc">{s.d}</p></div>
                  <div className="sx-line"><ul className="sx-tags">{s.tags.map(tag => <li key={tag} className="sx-tag">{tag}</li>)}</ul></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
