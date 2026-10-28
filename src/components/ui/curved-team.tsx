import { useEffect, useRef } from "react";
import { BAND_HEIGHT, cardOffset, cardShape, CORNER, DRIFT, FLING_KEEP_PER_SECOND, FRAME, roundedQuadPath } from "@/lib/curved-carousel";
import type { TeamMember } from "./team";

/** Largest card box in frame units; media and shade layers are sized to it once, then moved and scaled. */
const MEDIA_W = 300, MEDIA_H = 400;

/**
 * Desktop team row: portraits on the inside of a cylinder, drifting right to left.
 * The row follows a drag 1:1, coasts after release, then the slow drift carries on.
 * Every card is a rounded quad clipped each frame; only clip-path and transforms change.
 */
export function CurvedTeam({ members, isSample }: { members: TeamMember[]; isSample: boolean }) {
  const band = useRef<HTMLDivElement>(null);
  // Enough copies that the loop is wider than the screen and never shows a gap.
  const cards = Array.from({ length: Math.max(12, members.length) }, (_, i) => members[i % members.length]!);

  useEffect(() => {
    const root = band.current;
    if (!root) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const els = [...root.querySelectorAll<HTMLElement>(".team-curve-card")].map(card => ({
      card,
      media: card.querySelector<HTMLElement>(".team-curve-media")!,
      shade: card.querySelector<HTMLElement>(".team-curve-shade")!,
      caption: card.querySelector<HTMLElement>(".team-curve-caption")!,
    }));
    let unit = 1, offset = 0, fling = 0, last = 0, raf = 0, visible = false;
    let dragging = false, dragX = 0, dragT = 0, dragV = 0, pointerId = -1;

    const size = () => {
      unit = root.clientWidth / FRAME;
      root.style.height = `${BAND_HEIGHT * unit}px`;
      els.forEach(({ media, shade, caption }) => {
        caption.style.width = `${(170 - 28) * unit}px`;
        media.style.width = shade.style.width = `${MEDIA_W * unit}px`;
        media.style.height = `${MEDIA_H * unit}px`;
        shade.style.height = `${MEDIA_H * 0.45 * unit}px`;
      });
    };
    const paint = () => {
      els.forEach(({ card, media, shade, caption }, i) => {
        const shape = cardShape(cardOffset(i, offset, els.length));
        const off = shape.centre < -260 || shape.centre > FRAME + 260;
        card.style.visibility = off ? "hidden" : "visible";
        if (off) return;
        const [tl, tr, br, bl] = shape.corners;
        card.style.clipPath = `path("${roundedQuadPath(shape.corners, CORNER, unit)}")`;
        const left = tl.x, top = Math.min(tl.y, tr.y), bottom = Math.max(bl.y, br.y), width = shape.width, height = bottom - top;
        // Cover-fit the portrait to the card's bounding box with one uniform scale.
        const s = Math.max(width / MEDIA_W, height / MEDIA_H);
        media.style.transform = `translate3d(${(left + width / 2 - (MEDIA_W * s) / 2) * unit}px, ${(top + height / 2 - (MEDIA_H * s) / 2) * unit}px, 0) scale(${s})`;
        const inner = Math.min(bl.y, br.y);
        shade.style.transform = `translate3d(${left * unit}px, ${(bottom - MEDIA_H * 0.45) * unit}px, 0) scaleX(${width / MEDIA_W})`;
        caption.style.transform = `translate3d(${(left + 14) * unit}px, ${(inner - 14) * unit}px, 0) translateY(-100%)`;
      });
    };
    const frame = (now: number) => {
      raf = 0;
      if (!visible || !desktop.matches) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      if (!dragging) {
        offset += ((reduced.matches ? 0 : DRIFT) + fling) * dt;
        fling *= FLING_KEEP_PER_SECOND ** dt;
        if (Math.abs(fling) < 0.5) fling = 0;
      }
      paint();
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && visible && desktop.matches) { last = 0; raf = requestAnimationFrame(frame); } };

    const down = (e: PointerEvent) => {
      if (!desktop.matches) return;
      dragging = true; pointerId = e.pointerId; dragX = e.clientX; dragT = e.timeStamp; dragV = 0; fling = 0;
      root.setPointerCapture(e.pointerId);
      root.dataset["dragging"] = "true";
    };
    const move = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = (e.clientX - dragX) / unit, dt = Math.max(1, e.timeStamp - dragT) / 1000;
      offset += dx;
      dragV = dragV * 0.6 + (dx / dt) * 0.4;
      dragX = e.clientX; dragT = e.timeStamp;
      paint();
    };
    const up = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      // Hand the release velocity to the coast; it decays back into the slow drift.
      fling = e.timeStamp - dragT > 80 ? 0 : dragV - (reduced.matches ? 0 : DRIFT);
      delete root.dataset["dragging"];
    };

    const io = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; start(); }, { rootMargin: "200px" });
    io.observe(root);
    const ro = new ResizeObserver(() => { size(); paint(); });
    ro.observe(root);
    size(); paint();
    root.addEventListener("pointerdown", down);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerup", up);
    root.addEventListener("pointercancel", up);
    desktop.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      root.removeEventListener("pointerdown", down); root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerup", up); root.removeEventListener("pointercancel", up);
      desktop.removeEventListener("change", start);
    };
  }, [members]);

  return (
    <div ref={band} className="team-curve" role="group" aria-label="Մասնագետների լուսանկարներ">
      {cards.map((member, i) => (
        <article key={i} className="team-curve-card" aria-hidden={i >= members.length}>
          <img className="team-curve-media" src={member.photo} srcSet={member.photoSrcSet} sizes="300px" alt={isSample ? `Նմուշային դիմանկար ${(i % members.length) + 1}` : member.name} draggable={false} decoding="async" />
          <div className="team-curve-shade" />
          <div className="team-curve-caption"><h3>{member.name}</h3><p>{member.specialty}</p></div>
        </article>
      ))}
    </div>
  );
}
