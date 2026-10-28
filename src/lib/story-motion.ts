/**
 * Scroll choreography for the treatment-steps section. Everything is a pure function of
 * section progress `p` (0 when the stage pins, 1 when it releases), so scrolling back
 * plays every motion in reverse.
 */

/** Where an element sits on its way in: `y` is the share of its travel still to go
 * (1 = start, 0 = rest, slightly below 0 = the small overshoot as it settles). */
export type Rise = { y: number; scaleX: number; scaleY: number; opacity: number };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Ease-out with a gentle overshoot: fast start, soft landing just past rest. */
const OVERSHOOT = 0.9;
const backOut = (t: number) => 1 + (OVERSHOOT + 1) * (t - 1) ** 3 + OVERSHOOT * (t - 1) ** 2;
const PEAK_SPEED = OVERSHOOT + 3; // backOut'(0)

/**
 * Subtle squash and stretch (~3%): an element stretches tall and narrow while it moves
 * fast, then squashes a touch as it overshoots and settles. Volume is roughly kept, and
 * the pivot is its bottom edge (set in CSS).
 */
export function rise(t: number, reduced = false): Rise {
  const k = clamp01(t);
  if (reduced) return { y: 0, scaleX: 1, scaleY: 1, opacity: smooth(k) };
  if (k === 0) return { y: 1, scaleX: 1, scaleY: 1, opacity: 1 };
  if (k === 1) return { y: 0, scaleX: 1, scaleY: 1, opacity: 1 };
  const e = backOut(k);
  const speed = Math.abs(backOut(Math.min(1, k + 0.01)) - backOut(Math.max(0, k - 0.01))) / 0.02 / PEAK_SPEED;
  const settle = Math.max(0, e - 1);
  const scaleY = 1 + 0.03 * speed * (k > 0 && k < 1 ? 1 : 0) - 0.6 * settle;
  return { y: 1 - e, scaleX: 1 - (scaleY - 1) * 0.5, scaleY, opacity: 1 };
}

/** The four photos arrive spread across the section, one roughly per stretch of scroll. */
/** Arrival order (0 = first to land); three photos spread across the section. */
export const PHOTO_STARTS = [0.02, 0.32, 0.62] as const;
const PHOTO_TRAVEL = 0.16;
export const photoRise = (index: number, p: number, reduced = false) =>
  rise(seg(p, PHOTO_STARTS[index]!, PHOTO_STARTS[index]! + PHOTO_TRAVEL), reduced);

/** Each step's lines rise in from behind a mask, then lift out the same way for the next. */
export const STEP_IN = [0.02, 0.36, 0.69] as const;
export const STEP_OUT = [0.3, 0.63, Infinity] as const;
const LINE_IN = 0.09, LINE_OUT = 0.05, LINE_STAGGER = 0.025;
/** Lines travel a little more than their own height so they fully clear the mask, overshoot room included. */
const TRAVEL = 1.25;

/** A masked text line: `y` as a share of the line's own height (positive = below, negative = above). */
export type Line = { y: number; scaleY: number; opacity: number };

export function stepLine(step: number, line: number, p: number, reduced = false): Line {
  const start = STEP_IN[step]! + line * LINE_STAGGER;
  const leave = seg(p, STEP_OUT[step]! + line * LINE_STAGGER * 0.6, STEP_OUT[step]! + line * LINE_STAGGER * 0.6 + LINE_OUT);
  const enter = seg(p, start, start + LINE_IN);
  if (reduced) return { y: 0, scaleY: 1, opacity: Math.min(enter, 1 - leave) > 0.5 ? 1 : 0 };
  if (leave > 0) return { y: -smooth(leave) * TRAVEL, scaleY: 1, opacity: 1 };
  const r = rise(enter);
  return { y: r.y * TRAVEL, scaleY: r.scaleY, opacity: 1 };
}

/** Which step the text is showing, for the progress bars and screen readers. */
export function activeStep(p: number): number {
  return p < STEP_OUT[0] ? 0 : p < STEP_OUT[1] ? 1 : 2;
}

/** How "on" each progress bar is: 1 while its step is on screen, easing across hand-overs. */
export function barWeight(step: number, p: number): number {
  const on = step === 0 ? 1 : smooth(seg(p, STEP_IN[step]!, STEP_IN[step]! + LINE_IN));
  const off = step === 2 ? 0 : smooth(seg(p, STEP_OUT[step]!, STEP_OUT[step]! + LINE_OUT));
  return Math.min(on, 1 - off);
}

/**
 * The video's white frame stretching down to wrap each photo's place. A tab starts
 * growing a moment before its photo lands, overshoots a touch past full length (the
 * liquid give) and settles. Returns 0..~1.03 as a vertical scale.
 */
export function frameTab(index: number, p: number, reduced = false): number {
  const start = PHOTO_STARTS[index]! - 0.02;
  const t = seg(p, start, start + PHOTO_TRAVEL * 0.8);
  if (reduced) return t > 0 ? 1 : 0;
  if (t === 0 || t === 1) return t;
  return backOut(t);
}

/** Rounded (12px) while a corner is exposed, square once the neighbouring tab has joined. */
export const CORNER = 12;
export const cornerRadius = (neighbourTab: number) => CORNER * (1 - clamp01(neighbourTab));
