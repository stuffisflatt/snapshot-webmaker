import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Marquee({ children, className, duration = 40 }: {
  children: ReactNode; className?: string; duration?: number;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const images = Array.from(track.current?.querySelectorAll("img") ?? []);
    void Promise.all(images.map(image => image.decode().catch(() => {}))).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => { cancelled = true; };
  }, [children]);
  return (
    <div className={cn("team-marquee", className)} data-ready={ready}
      style={{ "--duration": `${duration}s` } as CSSProperties}>
      <div className="team-marquee-window" role="group" aria-label="Մասնագետների լուսանկարներ">
        <div ref={track} className="team-marquee-track">
          <div className="team-marquee-group">{children}</div>
          <div className="team-marquee-group" aria-hidden="true" inert>{children}</div>
        </div>
      </div>
    </div>
  );
}
