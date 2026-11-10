import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Phone, X } from "lucide-react";
import { CLINIC, DOCTORS, FIRST_AVAILABLE, SERVICES } from "@/lib/clinic";
import { setSmoothScrollPaused } from "@/components/SmoothScroll";
import { SwapText } from "@/components/HeroHeader";

export type BookingPreset = { service?: string; doctor?: string };

const CONSULT = "Խորհրդատվություն";
const TIMES = [{ id: "morning", label: "Առավոտ", hint: "09–12" }, { id: "midday", label: "Կեսօր", hint: "12–15" }, { id: "evening", label: "Երեկո", hint: "15–19" }];
/** How long the sheet takes to leave; it must match the CSS exit animation. */
const EXIT_MS = 260;

// Our own Armenian names: browsers' built-in Armenian date formatting is missing in several engines.
const WEEKDAYS = ["Կիր", "Երկ", "Երք", "Չրք", "Հնգ", "Ուրբ", "Շբթ"];
const MONTHS = ["հունվ", "փետր", "մարտ", "ապր", "մայիս", "հունիս", "հուլիս", "օգոստ", "սեպտ", "հոկտ", "նոյ", "դեկ"];

/** The next seven days, starting today, labelled in Armenian. */
function nextDays() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    return { key, day: i === 0 ? "Այսօր" : i === 1 ? "Վաղը" : WEEKDAYS[d.getDay()]!, date: d.getDate(), month: MONTHS[d.getMonth()]! };
  });
}

function Chips<T extends string>({ label, options, value, onChange }: { label: string; options: { id: T; text: string; hint?: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset className="bk-group">
      <legend className="bk-label">{label}</legend>
      <div className="bk-chips">
        {options.map(o => (
          <button key={o.id} type="button" className="bk-chip" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
            <span>{o.text}</span>{o.hint && <small>{o.hint}</small>}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Booking as a frosted sheet: it rises from the bottom on phones and settles in the centre on
 * larger screens, over a dimmed, blurred page. Choices are tappable chips rather than dropdowns.
 * This concept build sends nothing: the visitor finishes online or by phone.
 */
export function BookingSheet({ open, preset, onClose }: { open: boolean; preset: BookingPreset; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [service, setService] = useState(CONSULT);
  const [doctor, setDoctor] = useState(FIRST_AVAILABLE);
  const [day, setDay] = useState("");
  const [time, setTime] = useState("morning");
  const days = useMemo(() => (mounted ? nextDays() : []), [mounted]);

  const close = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { onClose(); return; }
    setClosing(true);
    window.setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  useEffect(() => {
    if (!open) { setMounted(false); setClosing(false); return; }
    setMounted(true);
    setService(preset.service ?? CONSULT);
    setDoctor(preset.doctor ?? FIRST_AVAILABLE);
    setDay("");
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    setSmoothScrollPaused(true);
    const focus = window.setTimeout(() => ref.current?.querySelector<HTMLElement>(".bk-close")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focus);
      document.body.style.overflow = "";
      setSmoothScrollPaused(false);
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open, preset, close]);

  if (!open) return null;
  const doctors = [FIRST_AVAILABLE, ...DOCTORS.map(d => d.name), ...(preset.doctor && !DOCTORS.some(d => d.name === preset.doctor) ? [preset.doctor] : [])];

  return (
    <div className="bk" data-state={closing ? "closing" : "open"} role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <button className="bk-scrim" aria-label="Փակել" tabIndex={-1} onClick={close} />
      <div ref={ref} className="bk-sheet" data-lenis-prevent>
        <span className="bk-grabber" aria-hidden="true" />
        <header className="bk-head">
          <div>
            <p className="bk-caption">(Ամրագրում)</p>
            <h2 id="booking-title" className="bk-title">Ամրագրել <span className="bk-serif">այցը</span></h2>
          </div>
          <button type="button" className="bk-close" aria-label="Փակել" onClick={close}><X /></button>
        </header>

        <form className="bk-form" onSubmit={e => e.preventDefault()}>
          <Chips label="Ծառայություն" value={service} onChange={setService}
            options={[{ id: CONSULT, text: CONSULT }, ...SERVICES.map(s => ({ id: s.title, text: s.title }))]} />
          <Chips label="Բժիշկ" value={doctor} onChange={setDoctor} options={doctors.map(d => ({ id: d, text: d }))} />

          <fieldset className="bk-group">
            <legend className="bk-label">Նախընտրելի օր</legend>
            <div className="bk-days">
              {days.map(d => (
                <button key={d.key} type="button" className="bk-day" aria-pressed={day === d.key} onClick={() => setDay(d.key)}>
                  <small>{d.day}</small><strong>{d.date}</strong><small>{d.month}</small>
                </button>
              ))}
            </div>
          </fieldset>
          <Chips label="Ժամ" value={time} onChange={setTime} options={TIMES.map(t => ({ id: t.id, text: t.label, hint: t.hint }))} />

          <div className="bk-fields">
            <label className="bk-field"><span className="bk-label">Անուն</span><input autoComplete="name" placeholder="Ձեր անունը" /></label>
            <label className="bk-field"><span className="bk-label">Հեռախոս</span><input type="tel" autoComplete="tel" inputMode="tel" placeholder="+374" /></label>
          </div>

          <div className="bk-actions">
            <a className="clinic-hero-cta clinic-hero-cta-book" href={CLINIC.yandex} target="_blank" rel="noopener noreferrer"><SwapText text="Ամրագրել առցանց" hover="Բացել քարտեզում" /><ArrowUpRight /></a>
            <a className="clinic-hero-cta clinic-hero-cta-call" href={CLINIC.mobileHref}><Phone /><SwapText text="Զանգահարել" hover={CLINIC.mobile} /><ArrowUpRight /></a>
          </div>
          <p className="bk-note">Կլինիկան կհաստատի օրը և ժամը։ Այս տարբերակում տվյալները չեն ուղարկվում․ ավարտեք առցանց կամ զանգով։</p>
        </form>
      </div>
    </div>
  );
}
