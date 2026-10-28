import { useEffect, useRef, type RefObject } from "react";

export function HeroDots({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg || window.matchMedia("(max-width: 600px)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const interactive = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    type Dot = { x: number; y: number; dx: number; dy: number; node: SVGCircleElement; phase: number };
    let dots: Dot[] = [];
    let pointer: { x: number; y: number } | null = null;
    let frame = 0, lastTime = 0, visible = true;
    const schedule = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    function tick(now: number) {
      frame = 0;
      const dt = lastTime ? Math.min(50, now - lastTime) : 16;
      lastTime = now;
      const nearby = pointer && !reduced.matches ? dots
        .map(dot => ({ dot, distance: Math.hypot(dot.x - pointer!.x, dot.y - pointer!.y) }))
        .filter(item => item.distance < 125)
        .sort((a, b) => a.distance - b.distance).slice(0, 10) : [];
      const active = new Map(nearby.map(item => [item.dot, item.distance]));
      let settling = false;
      for (const dot of dots) {
        let tx = 0, ty = 0;
        const distance = active.get(dot);
        if (pointer && distance !== undefined) {
          const weight = Math.pow(1 - distance / 125, .65);
          const angle = distance > .1 ? Math.atan2(dot.y - pointer.y, dot.x - pointer.x) : dot.phase;
          tx = (Math.cos(angle) * 48 + Math.sin(now / 1500 + dot.phase) * 2) * weight;
          ty = (Math.sin(angle) * 48 + Math.cos(now / 1800 + dot.phase) * 2) * weight;
        }
        const ease = 1 - Math.exp(-dt / (active.has(dot) ? 65 : 650));
        dot.dx += (tx - dot.dx) * ease;
        dot.dy += (ty - dot.dy) * ease;
        if (Math.abs(dot.dx) + Math.abs(dot.dy) < .02 && !active.has(dot)) {
          dot.dx = 0; dot.dy = 0;
          dot.node.removeAttribute("transform");
        } else {
          dot.node.setAttribute("transform", `translate(${dot.dx.toFixed(2)} ${dot.dy.toFixed(2)})`);
          settling = true;
        }
      }
      if (settling || active.size) schedule(); else lastTime = 0;
    }
    const resize = () => {
      const width = container.clientWidth, height = container.clientHeight;
      svg!.setAttribute("viewBox", `0 0 ${width} ${height}`);
      dots = [];
      const fragment = document.createDocumentFragment();
      const spacing = 38.57175;
      for (let row = 0, y = 10; y <= height; row++, y += spacing) {
        for (let x = 10 + (row % 2) * spacing / 2; x <= width / 2 + spacing; x += spacing) {
          const node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          node.setAttribute("cx", String(x)); node.setAttribute("cy", String(y)); node.setAttribute("r", "1.60725");
          const shade = Math.round(170 - 14 * Math.min(1, y / Math.max(1, height)));
          node.setAttribute("fill", `rgb(${shade} ${shade} ${shade})`);
          dots.push({ x, y, dx: 0, dy: 0, node, phase: dots.length * 2.39996 });
          fragment.append(node);
        }
      }
      svg!.replaceChildren(fragment);
    };
    const move = (event: PointerEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      pointer = x <= rect.width / 2 ? { x, y: event.clientY - rect.top } : null;
      schedule();
    };
    const leave = () => { pointer = null; schedule(); };
    const sync = () => {
      cancelAnimationFrame(frame); frame = 0; lastTime = 0;
      if (reduced.matches) pointer = null;
      schedule();
    };
    const sizeObserver = new ResizeObserver(resize);
    const viewObserver = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; sync(); });
    sizeObserver.observe(container); viewObserver.observe(container);
    container.addEventListener("pointermove", move, { passive: true });
    container.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    resize();
    return () => {
      cancelAnimationFrame(frame); sizeObserver.disconnect(); viewObserver.disconnect();
      container.removeEventListener("pointermove", move); container.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync); reduced.removeEventListener("change", sync);
    };
  }, [containerRef]);
  return <svg ref={svgRef} className="clinic-hero-dots" aria-hidden="true" />;
}
