# Clinic configs

Everything that changes from one clinic to the next lives in one JSON file here. The template's
interface wording (button labels, form labels, section titles) stays in the components.

- `alphastom.json` is the default and the live site.
- To make a new clinic, copy `alphastom.json` to `<slug>.json` and edit it.
- To build or run another clinic, set `CLINIC=<slug>`:
  - `CLINIC=smilepro npm run dev`
  - `CLINIC=smilepro npm run build`
- The file is checked when the site starts (`src/lib/clinic.ts`). A missing or empty field stops the
  build and names the field.

## Placeholders

These work in `seo.*`, `hero.locationNote` and `faq[].a`: `{name}`, `{brand}`, `{address}`,
`{mobile}`, `{hours}`, `{founded}`, `{rating}` and `{ratingCount}`.

## Media

Paths are site URLs under `public/`. Put a new clinic's files in `public/clinics/<slug>/` and point
the config at them, for example `"video": "/clinics/smilepro/hero.mp4"`.

- `story.frames` must hold `001.webp`–`074.webp`, cut from the story video.
- `story.stills` must hold `001.webp`–`107.webp`, cut from the story video.
- If the clinic has no new story footage, keep Alphastom's paths.

## Key fields

| Field | What it controls |
| --- | --- |
| `headline` | The big hero name: `swash` (decorative initial) + `left` / `right` halves + `sub` line |
| `brandLocal` | The name in Armenian in the phone menu: plain part and serif part |
| `doctors[].short` | The specialty shown in the booking sheet |
| `doctors[].role` | The specialty shown in the doctors section |
| `doctorShowcaseOrder` | Order of the doctors section, as indexes into `doctors` (optional) |
| `results.sample` / `reviews[].sample` | Show the "Նմուշ" (sample) tag until real photos and reviews replace them |
| `contact.bookingWhatsApp` | Receives booking requests. It is never shown on the page |
