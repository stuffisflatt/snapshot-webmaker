import { useEffect, useRef, useState } from "react";
import { X, Phone, MapPin } from "lucide-react";
import { CLINIC, DOCTORS, FIRST_AVAILABLE, SERVICES } from "@/lib/clinic";

export type BookingPreset = { service?: string; doctor?: string };

export function BookingSheet({ open, preset, onClose }: { open: boolean; preset: BookingPreset; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [service, setService] = useState("");
  const [doctor, setDoctor] = useState(FIRST_AVAILABLE);

  useEffect(() => {
    if (!open) return;
    setService(preset.service ?? "");
    setDoctor(preset.doctor ?? FIRST_AVAILABLE);
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    setTimeout(() => ref.current?.querySelector<HTMLElement>("select, input")?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open, preset, onClose]);

  if (!open) return null;
  const field = "mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary";
  const label = "block text-sm font-medium";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <button aria-label="Փակել" onClick={onClose} className="absolute inset-0 bg-foreground/50 animate-in fade-in duration-200" />
      <div ref={ref} className="relative max-h-[92svh] w-full overflow-y-auto rounded-t-2xl bg-background p-6 pb-8 shadow-card animate-in slide-in-from-bottom-8 duration-300 sm:max-w-lg sm:rounded-2xl">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border sm:hidden" />
        <div className="flex items-start justify-between gap-4">
          <h2 id="booking-title" className="text-2xl font-bold">Ամրագրել այցը</h2>
          <button onClick={onClose} aria-label="Փակել" className="grid size-10 place-items-center rounded-lg bg-muted hover:bg-accent"><X className="size-5" /></button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Ամսաթիվը և ժամը նախընտրելի են․ այցը հաստատում է կլինիկան։</p>
        <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <label className={label}>Ծառայություն
            <select className={field} value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">Դեռ չգիտեմ / խորհրդատվություն</option>
              {SERVICES.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
            </select>
          </label>
          <label className={label}>Նախընտրելի բժիշկ
            <select className={field} value={doctor} onChange={(e) => setDoctor(e.target.value)}>
              <option>{FIRST_AVAILABLE}</option>
              {DOCTORS.map((d) => <option key={d.name}>{d.name}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={label}>Նախընտրելի օր<input type="date" className={field} /></label>
            <label className={label}>Ժամ<input type="time" className={field} /></label>
          </div>
          <label className={label}>Անուն<input autoComplete="name" className={field} /></label>
          <label className={label}>Հեռախոս<input type="tel" autoComplete="tel" inputMode="tel" className={field} placeholder="+374" /></label>
          <div className="grid gap-3 pt-2 sm:grid-cols-2">
            <a href={CLINIC.yandex} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><MapPin className="size-4" />Ամրագրել առցանց</a>
            <a href={CLINIC.mobileHref} className="btn btn-outline"><Phone className="size-4" />Զանգահարել</a>
          </div>
          <p className="text-xs text-muted-foreground">Կոնցեպտ տարբերակում տվյալները չեն ուղարկվում․ ամրագրումն ավարտեք առցանց կամ զանգով։</p>
        </form>
      </div>
    </div>
  );
}
