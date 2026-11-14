import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, MessageCircle, Phone, X } from "lucide-react";
import { CLINIC, DOCTORS, FIRST_AVAILABLE, SERVICES } from "@/lib/clinic";
import { useSheet } from "@/components/useSheet";
import { SwapText } from "@/components/HeroHeader";

export type BookingPreset = { service?: string; doctor?: string };

const CONSULT = "Խորհրդատվություն";
const TIMES = [{ id: "morning", label: "Առավոտ", hint: "09–12" }, { id: "midday", label: "Կեսօր", hint: "12–15" }, { id: "evening", label: "Երեկո", hint: "15–19" }];

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

function Chips<T extends string>({ label, options, value, onChange }: { label: string; options: { id: T; text: string; hint?: string | undefined }[]; value: T; onChange: (v: T) => void }) {
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
 * Sending opens WhatsApp with the request written out; the clinic confirms the day and time.
 */
export function BookingSheet({ open, preset, onClose }: { open: boolean; preset: BookingPreset; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [service, setService] = useState(CONSULT);
  const [doctor, setDoctor] = useState(FIRST_AVAILABLE);
  const [day, setDay] = useState("");
  const [time, setTime] = useState("morning");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const days = useMemo(() => (mounted ? nextDays() : []), [mounted]);
  const { ref, closing, close, reopen } = useSheet(open, onClose);

  // Each booking request (a new preset) resets the choices and cancels an exit still in progress.
  useEffect(() => {
    if (!open) { setMounted(false); return; }
    setMounted(true);
    setService(preset.service ?? CONSULT);
    setDoctor(preset.doctor ?? FIRST_AVAILABLE);
    setDay("");
    setTime("morning");
    reopen();
  }, [open, preset, reopen]);

  if (!open) return null;
  const doctors = [FIRST_AVAILABLE, ...DOCTORS.map(d => d.name), ...(preset.doctor && !DOCTORS.some(d => d.name === preset.doctor) ? [preset.doctor] : [])];

  // The request goes to the clinic's WhatsApp as a ready-written message; the visitor only taps Send.
  const send = () => {
    const d = days.find(x => x.key === day);
    const t = TIMES.find(x => x.id === time)!;
    const lines = [
      "Բարև Ձեզ, ցանկանում եմ ամրագրել այց։",
      `Ծառայություն՝ ${service}`,
      `Բժիշկ՝ ${doctor}`,
      `Օր՝ ${d ? `${d.day}, ${d.date} ${d.month}` : "ցանկացած"}`,
      `Ժամ՝ ${t.label} (${t.hint})`,
      name.trim() && `Անուն՝ ${name.trim()}`,
      phone.trim() && `Հեռախոս՝ ${phone.trim()}`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${CLINIC.bookingWhatsApp}?text=${encodeURIComponent(lines)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bk" data-state={closing ? "closing" : "open"} role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <button className="bk-scrim" aria-label="Փակել" tabIndex={-1} onClick={() => close()} />
      <div ref={ref} className="bk-sheet" data-lenis-prevent>
        <span className="bk-grabber" aria-hidden="true" />
        <header className="bk-head">
          <div>
            <p className="bk-caption bk-rating"><span aria-hidden="true">★</span> 4.8 · {CLINIC.ratingCount} կարծիք Google-ում</p>
            <h2 id="booking-title" className="bk-title">Ամրագրել <span className="bk-serif">այցը</span></h2>
          </div>
          <button type="button" className="bk-close" aria-label="Փակել" onClick={() => close()}><X /></button>
        </header>

        <form className="bk-form" onSubmit={e => { e.preventDefault(); send(); }}>
          <Chips label="Ծառայություն" value={service} onChange={setService}
            options={[{ id: CONSULT, text: CONSULT }, ...SERVICES.map(s => ({ id: s.title, text: s.title }))]} />
          <Chips label="Բժիշկ" value={doctor} onChange={setDoctor} options={doctors.map(d => ({ id: d, text: d, hint: DOCTORS.find(x => x.name === d)?.specialty }))} />

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
            <label className="bk-field"><span className="bk-label">Անուն</span><input autoComplete="name" placeholder="Ձեր անունը" value={name} onChange={e => setName(e.target.value)} /></label>
            <label className="bk-field"><span className="bk-label">Հեռախոս</span><input type="tel" autoComplete="tel" inputMode="tel" placeholder="+374" value={phone} onChange={e => setPhone(e.target.value)} /></label>
          </div>

          <div className="bk-actions">
            <button type="submit" className="clinic-hero-cta clinic-hero-cta-book"><MessageCircle /><SwapText text="Ուղարկել WhatsApp-ով" hover="Պատրաստ է ուղարկման" /><ArrowUpRight /></button>
            <a className="clinic-hero-cta clinic-hero-cta-call" href={CLINIC.mobileHref}><Phone /><SwapText text="Զանգահարել" hover={CLINIC.mobile} /><ArrowUpRight /></a>
          </div>
          <p className="bk-note">Կբացվի WhatsApp-ը՝ պատրաստի հաղորդագրությամբ։ Կլինիկան կհաստատի օրը և ժամը։</p>
        </form>
      </div>
    </div>
  );
}
