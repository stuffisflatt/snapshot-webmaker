import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { SERVICES } from "@/lib/clinic";
import { Button } from "@/components/ui/button";
import { riseStyle } from "@/components/Reveal";

export function ServiceAccordion({ onBook }: { onBook: (service: string) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const [lensMap, setLensMap] = useState<string>();
  const listRef = useRef<HTMLDivElement>(null);

  // Performance: each card paints its own copy of the section photo, lined up exactly with the photo
  // behind it, and the glass filter runs on that copy. Unlike a backdrop filter, which re-runs on
  // every frame while scrolling, a filter on still content is drawn once and reused. Positions come
  // from layout offsets (not transforms), so the cards' rise-in animation never skews them.
  useEffect(() => {
    const list = listRef.current;
    const section = list?.closest<HTMLElement>("section");
    if (!list || !section) return;
    const IMAGE_W = 2880, IMAGE_H = 1608, BLEED = 40;
    let raf = 0;
    const offsetIn = (el: HTMLElement) => {
      let x = 0, y = 0, node: HTMLElement | null = el;
      while (node && node !== section) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
      return { x, y };
    };
    const place = () => {
      raf = 0;
      const sw = section.clientWidth, sh = section.clientHeight;
      const scale = Math.max(sw / IMAGE_W, sh / IMAGE_H);
      const w = IMAGE_W * scale, h = IMAGE_H * scale;
      const ox = (sw - w) / 2, oy = (sh - h) / 2;
      list.querySelectorAll<HTMLElement>(".service-item").forEach(card => {
        const { x, y } = offsetIn(card);
        card.style.setProperty("--glass-pos", `${(ox - x + BLEED).toFixed(1)}px ${(oy - y + BLEED).toFixed(1)}px`);
        card.style.setProperty("--glass-size", `${w.toFixed(1)}px ${h.toFixed(1)}px`);
      });
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(place); };
    const resize = new ResizeObserver(schedule);
    resize.observe(section);
    list.querySelectorAll(".service-item").forEach(card => resize.observe(card));
    schedule();
    // While a card opens or closes, the cards under it slide without resizing: keep their photo
    // copies lined up every frame until the panel has settled.
    let follow = 0, until = 0;
    const tick = () => { place(); follow = performance.now() < until ? requestAnimationFrame(tick) : 0; };
    const onClick = () => { until = performance.now() + 450; if (!follow) follow = requestAnimationFrame(tick); };
    list.addEventListener("click", onClick);
    return () => { resize.disconnect(); cancelAnimationFrame(raf); cancelAnimationFrame(follow); list.removeEventListener("click", onClick); };
  }, []);

  // The whole services block keeps room at its bottom for the tallest open panel, so opening a card
  // never changes the block's height: the centred heading, the other cards and the photo behind
  // them all stay still, while the note under the cards follows them at its normal gap.
  useEffect(() => {
    const list = listRef.current;
    const block = list?.parentElement;
    if (!list || !block) return;
    const reserve = () => {
      block.style.minHeight = "";
      const open = list.querySelector<HTMLElement>('.service-item[data-open="true"] .service-panel');
      const closed = block.offsetHeight - (open?.offsetHeight ?? 0);
      const tallest = Math.max(0, ...[...list.querySelectorAll<HTMLElement>(".service-panel-content")].map(p => p.offsetHeight));
      block.style.minHeight = `${Math.ceil(closed + tallest)}px`;
    };
    reserve();
    window.addEventListener("resize", reserve);
    return () => window.removeEventListener("resize", reserve);
  }, []);

  // Build the displacement map once: neutral grey in the middle, ramping smoothly toward each edge so
  // the backdrop near the rim is pulled inward (R = horizontal, G = vertical), as a curved edge would.
  useEffect(() => {
    const w = 512, h = 160, rim = .22;
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(w, h);
    const ramp = (t: number) => (t >= rim ? 0 : (1 + Math.cos((t / rim) * Math.PI)) / 2);
    for (let y = 0; y < h; y++) {
      const v = y / (h - 1), dy = ramp(v) - ramp(1 - v);
      for (let x = 0; x < w; x++) {
        const u = x / (w - 1), dx = ramp(u) - ramp(1 - u), i = (y * w + x) * 4;
        img.data[i] = 128 + dx * 127;
        img.data[i + 1] = 128 + dy * 127;
        img.data[i + 2] = 128;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    setLensMap(canvas.toDataURL());
  }, []);

  return (
    <>
    {/* Curved-glass refraction for the cards: a lens map bends the backdrop strongly near each card's
        edges and leaves the middle flat, like a pane with rounded, thick edges. The red, green and blue
        channels bend by slightly different amounts, splitting colour along those edges. */}
    <svg className="glass-filter" aria-hidden="true" width="0" height="0">
      <filter id="glass-warp" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        {lensMap && <feImage href={lensMap} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="soft" />}
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="70" xChannelSelector="R" yChannelSelector="G" result="bentR" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="60" xChannelSelector="R" yChannelSelector="G" result="bentG" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="50" xChannelSelector="R" yChannelSelector="G" result="bentB" />
        <feColorMatrix in="bentR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
        <feColorMatrix in="bentG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
        <feColorMatrix in="bentB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
        <feComposite in="r" in2="g" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rg" />
        <feComposite in="rg" in2="b" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
      </filter>
    </svg>
    {/* Two independent columns sharing one open state: opening a card only grows its own column. */}
    <div ref={listRef} className="service-list">
      {[SERVICES.slice(0, 3), SERVICES.slice(3)].map((column, c) => (
      <ul key={c} className="service-col">
      {column.map((service, r) => {
        const open = active === service.id;
        return (
          <li key={service.id} className="service-item rise" style={riseStyle(2 + r * 2 + c)} data-open={open}
            onKeyDown={event => { if (event.key === "Escape") setActive(null); }}>
            <h3>
              <Button variant="ghost" id={`svc-trigger-${service.id}`} className="service-trigger" aria-expanded={open} aria-controls={`svc-${service.id}`}
                onClick={() => setActive(current => current === service.id ? null : service.id)}>
                <span>{service.title}</span><ChevronDown className="service-chevron" size={20} />
              </Button>
            </h3>
            <div id={`svc-${service.id}`} className="service-panel" role="region" aria-labelledby={`svc-trigger-${service.id}`} aria-hidden={!open} inert={!open}>
              <div className="service-panel-clip">
                <div className="service-panel-content">
                  <p className="text-muted-foreground">{service.text}</p>
                  <p className="service-price">սկսած {service.from} ֏</p>
                  <Button className="btn btn-primary mt-4 text-sm" onClick={() => onBook(service.title)}>Ամրագրել այս ծառայության համար</Button>
                </div>
              </div>
            </div>
          </li>
        );
      })}
      </ul>
      ))}
    </div>
    </>
  );
}
