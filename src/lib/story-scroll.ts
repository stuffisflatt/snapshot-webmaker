/** Bound wheel bursts without ever pinning the browser to an endpoint. */
export function storyScrollDelta(y: number, delta: number, start: number, end: number, viewport: number): number {
  if (!delta || viewport <= 0) return delta;
  // Outward scrolling is always native, including fractional browser positions.
  if ((y <= start && delta < 0) || (y >= end && delta > 0)) return delta;
  const limit = viewport * .4;
  if (y < start) return delta > 0 && y + delta > start ? Math.min(delta, start - y + limit) : delta;
  if (y > end) return delta < 0 && y + delta < end ? Math.max(delta, end - y - limit) : delta;
  // Do not clamp to start/end: the final input must carry the user out.
  return Math.sign(delta) * Math.min(Math.abs(delta), limit);
}
