/**
 * Geometry for the curved team carousel: cards seen on the inside of a cylinder. All
 * values are in frame units on a 1440-wide frame (centre x = 720); the caller scales
 * them to pixels. Formulas follow the agreed reference: centre cards are upright
 * 170×280, edge cards widen and grow to ~370 tall with their outer edge the taller one.
 */
export const FRAME = 1440;
const CENTRE = 720, REACH = 706;
export const PITCH = 196;
/** Auto-scroll speed (units per second, right to left) and fling decay (keeps 5% per second). */
export const DRIFT = -50;
export const FLING_KEEP_PER_SECOND = 0.05;
/** Vertical centre of the band's middle card, in units from the band top. */
export const BAND_HEIGHT = 420;
const MID_Y = 210;
export const CORNER = 12;

export type Point = { x: number; y: number };
export type CardShape = { centre: number; width: number; corners: [Point, Point, Point, Point] };

/** Push an evenly spaced offset outward so gaps stay ~26u even where cards widen. */
export const pushOut = (t: number) => CENTRE + t * (1 + 0.083 * (t / REACH) ** 2);
const edgeHeight = (x: number) => 280 + 92 * (Math.abs(x - CENTRE) / REACH) ** 2.6;

/** The card whose unpushed centre sits `t` units from the frame centre. */
export function cardShape(t: number): CardShape {
  const centre = pushOut(t);
  // Width and lift use the evenly spaced (unpushed) distance; that is what keeps the
  // ~26u gaps once centres are pushed out. Edge heights use each edge's own position.
  const d = Math.abs(t) / REACH;
  const width = 170 + 48 * d * d;
  const left = centre - width / 2, right = centre + width / 2;
  const hl = edgeHeight(left), hr = edgeHeight(right);
  const mid = MID_Y - 12 * d * d;
  return {
    centre, width,
    corners: [
      { x: left, y: mid - hl / 2 }, { x: right, y: mid - hr / 2 },
      { x: right, y: mid + hr / 2 }, { x: left, y: mid + hl / 2 },
    ],
  };
}

/** SVG path for a quad with rounded corners (radius r, eased with quadratic curves). */
export function roundedQuadPath(points: Point[], r: number, scale = 1, origin: Point = { x: 0, y: 0 }): string {
  const n = points.length;
  const at = (p: Point) => `${((p.x - origin.x) * scale).toFixed(2)} ${((p.y - origin.y) * scale).toFixed(2)}`;
  const toward = (a: Point, b: Point) => {
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1, k = Math.min(r, len / 2) / len;
    return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
  };
  let d = "";
  for (let i = 0; i < n; i++) {
    const p = points[i]!, prev = points[(i - 1 + n) % n]!, next = points[(i + 1) % n]!;
    const a = toward(p, prev), b = toward(p, next);
    d += `${i === 0 ? "M" : "L"} ${at(a)} Q ${at(p)} ${at(b)} `;
  }
  return `${d}Z`;
}

/** Wrap a scroll offset so each of `count` cards gets an offset in [-loop/2, loop/2). */
export function cardOffset(index: number, offset: number, count: number): number {
  const loop = count * PITCH;
  const raw = index * PITCH + offset;
  return ((((raw + loop / 2) % loop) + loop) % loop) - loop / 2;
}
