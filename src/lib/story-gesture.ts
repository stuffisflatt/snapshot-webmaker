export function nextStoryStage(stage: number, direction: number): number | null {
  const next = stage + Math.sign(direction);
  return next >= 0 && next <= 2 ? next : null;
}

export function storyEntryStage(previousY: number, nextY: number, start: number, end: number): 0 | 2 | null {
  if (previousY < start && nextY >= start) return 0;
  if (previousY > end && nextY <= end) return 2;
  return null;
}

// A trackpad fling can emit wheel events long after the initial input.
// Require a quiet interval as well as a completed animation before advancing.
export class StoryGestureGate {
  private lastInput = -Infinity;
  constructor(private quietMs = 240) {}
  take(now: number, busy: boolean): boolean {
    const fresh = now - this.lastInput > this.quietMs;
    this.lastInput = now;
    return fresh && !busy;
  }
}

export function storyGestureBusy(now: number, moving: boolean, landed: boolean, busyUntil: number, phone: boolean): boolean {
  return moving || now < busyUntil || (!landed && (phone || now < busyUntil + 1200));
}
