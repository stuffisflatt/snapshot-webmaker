import { z } from "zod";
// "@clinic-data" is the clinic this build is for: src/clinics/<CLINIC>.json, chosen by the CLINIC
// environment variable (default "alphastom"; see vite.config.ts). Everything that differs between
// clinics lives in that one file; interface wording (buttons, labels) stays in the components.
import data from "@clinic-data";

const text = z.string().min(1);
const schema = z.object({
  slug: text,
  name: text,
  brand: text,
  brandLocal: z.tuple([z.string(), z.string()]),
  // center: centre the whole name (halves of unequal width) instead of splitting it at the video seam.
  // plainInitial: the first letter in the headline's own font, for capitals the script font draws
  // unreadably. subShift: moves "Dental Clinic" right by this many CSS pixels. scale: the name's size
  // (the subline keeps its size). shift: moves the name right (negative: left) by CSS pixels.
  headline: z.object({
    swash: z.string(), left: z.string(), right: z.string(), sub: z.string(),
    center: z.boolean().optional(), plainInitial: z.boolean().optional(), subShift: z.number().optional(),
    scale: z.number().positive().optional(), shift: z.number().optional(),
  }),
  seo: z.object({ title: text, description: text, ogTitle: text, ogDescription: text, ogImage: text }),
  contact: z.object({
    // No landline, Instagram or Facebook: the contact rows show the address and the Google rating instead.
    address: text, addressLines: z.array(text).min(1), mobile: text, landline: text.optional(),
    instagram: text.optional(), instagramHandle: text.optional(), facebook: text.optional(), maps: text, bookingWhatsApp: text, hours: text,
  }),
  rating: z.object({ value: text, count: text }),
  founded: z.number().int().optional(), // unknown: left out of the footer; texts must not use {founded}
  hero: z.object({
    value: z.array(text).min(1), chips: z.array(text), taglines: z.array(text).min(1), statement: text,
    locationNote: text, video: text, videoPhone: text, poster: text,
  }),
  story: z.object({
    video: text, poster: text, frames: text, stills: text, sample: z.boolean().optional(),
    steps: z.array(z.object({ title: text, serif: text, text: text, tags: z.array(text) })).length(3),
    photos: z.array(z.object({ src: text, alt: text })),
  }),
  doctors: z.array(z.object({
    name: text, role: text, short: text, line: text, stats: z.array(text), education: z.array(text).length(2),
    languages: z.array(text).min(1), specs: z.array(text), photo: text,
  })).min(1),
  doctorShowcaseOrder: z.array(z.number().int().nonnegative()).optional(),
  services: z.array(z.object({
    id: text, from: text, title: text, text: text,
    items: z.array(z.object({ name: text, price: text })).min(1),
  })).min(1),
  results: z.object({
    lede: text, sample: z.boolean(),
    items: z.array(z.object({ after: text, before: text.optional(), alt: text })),
  }),
  reviews: z.array(z.object({
    id: z.number(), name: text, role: text, content: text, rating: z.number().min(1).max(5),
    sample: z.boolean().optional(), source: z.literal("google").optional(),
  })).min(1),
  faq: z.array(z.object({ q: text, a: text })),
});

export type ClinicConfig = z.infer<typeof schema>;

const parsed = schema.safeParse(data);
if (!parsed.success) {
  throw new Error(`Clinic config is invalid:\n${parsed.error.issues.map(i => `  ${i.path.join(".")}: ${i.message}`).join("\n")}`);
}
export const CONFIG: ClinicConfig = parsed.data;

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Fills {name}, {brand}, {address}, {mobile}, {hours}, {founded}, {rating}, {ratingCount} in config text. */
export function fill(template: string) {
  const values: Record<string, string> = {
    name: CONFIG.name, brand: CONFIG.brand, address: CONFIG.contact.address, mobile: CONFIG.contact.mobile,
    hours: CONFIG.contact.hours, founded: String(CONFIG.founded ?? ""), rating: CONFIG.rating.value, ratingCount: CONFIG.rating.count,
  };
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

// The shape the components were written against, derived from the config.
export const CLINIC = {
  name: CONFIG.name,
  address: CONFIG.contact.address,
  mobile: CONFIG.contact.mobile,
  mobileHref: telHref(CONFIG.contact.mobile),
  landline: CONFIG.contact.landline,
  landlineHref: CONFIG.contact.landline ? telHref(CONFIG.contact.landline) : undefined,
  instagram: CONFIG.contact.instagram,
  facebook: CONFIG.contact.facebook,
  yandex: CONFIG.contact.maps,
  rating: `${CONFIG.rating.value}/5`,
  ratingCount: CONFIG.rating.count,
  founded: CONFIG.founded,
  hours: CONFIG.contact.hours,
  // Booking requests go to this WhatsApp number; it is only used inside the wa.me link, never shown.
  bookingWhatsApp: CONFIG.contact.bookingWhatsApp,
};

export const FIRST_AVAILABLE = "Առաջին հասանելի մասնագետը";

export const SERVICES = CONFIG.services;

/** The booking sheet's doctor list (config order, short specialty). */
export const DOCTORS: { name: string; specialty: string }[] = CONFIG.doctors.map(d => ({ name: d.name, specialty: d.short }));
