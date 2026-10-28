import { describe, expect, it } from "vitest";
import { nextStoryStage, storyEntryStage, StoryGestureGate, storyGestureBusy } from "./story-gesture";

describe("one-stage scroll gestures", () => {
  it("recovers desktop controls if a decoded frame arrives late, without changing phone gating", () => {
    expect(storyGestureBusy(1000, true, false, 1200, false)).toBe(true);
    expect(storyGestureBusy(1300, false, false, 1200, false)).toBe(true);
    expect(storyGestureBusy(2500, false, false, 1200, false)).toBe(false);
    expect(storyGestureBusy(2500, false, false, 1200, true)).toBe(true);
    expect(storyGestureBusy(2500, false, true, 1200, true)).toBe(false);
  });
  it("recognizes separate desktop wheel gestures without weakening phone momentum filtering", () => {
    const desktop = new StoryGestureGate(120);
    const phone = new StoryGestureGate();
    expect(desktop.take(0, false)).toBe(true);
    expect(phone.take(0, false)).toBe(true);
    for (const now of [140, 280, 420]) {
      expect(desktop.take(now, false)).toBe(true);
      expect(phone.take(now, false)).toBe(false);
    }
  });
  it("still absorbs continuous desktop trackpad momentum", () => {
    const desktop = new StoryGestureGate(120);
    expect(desktop.take(0, false)).toBe(true);
    for (let now = 16; now < 2000; now += 16) expect(desktop.take(now, now < 1200)).toBe(false);
    expect(desktop.take(2200, false)).toBe(true);
  });
  it("catches entry even when one scroll crosses the entire teeth section", () => {
    expect(storyEntryStage(100, 5000, 900, 1140)).toBe(0);
    expect(storyEntryStage(5000, 100, 900, 1140)).toBe(2);
    expect(storyEntryStage(899, 900, 900, 1140)).toBe(0);
    expect(storyEntryStage(1141, 1140, 900, 1140)).toBe(2);
  });
  it("keeps scrolling outside the section and outward exits natural", () => {
    for (const [before, after] of [[100, 300], [1500, 3000], [900, 100], [1140, 4000], [950, 1050]] as const) {
      expect(storyEntryStage(before, after, 900, 1140)).toBeNull();
    }
  });
  it("advances one stage regardless of wheel strength, and allows exit only at endpoints", () => {
    for (const delta of [1, 120, 1000, 100000]) {
      expect(nextStoryStage(0, delta)).toBe(1);
      expect(nextStoryStage(1, delta)).toBe(2);
      expect(nextStoryStage(2, -delta)).toBe(1);
    }
    expect(nextStoryStage(2, 1000)).toBeNull();
    expect(nextStoryStage(0, -1000)).toBeNull();
  });
  it("consumes momentum from a hard fling until it goes quiet", () => {
    const gate = new StoryGestureGate();
    expect(gate.take(0, false)).toBe(true);
    for (let now = 16; now < 2000; now += 16) expect(gate.take(now, now < 1200)).toBe(false);
    expect(gate.take(2400, false)).toBe(true);
  });
  it("blocks a new gesture while the transition or resting frame is still loading", () => {
    const gate = new StoryGestureGate();
    expect(gate.take(0, false)).toBe(true);
    expect(gate.take(500, true)).toBe(false);
    expect(gate.take(1000, true)).toBe(false);
    expect(gate.take(1400, false)).toBe(true);
  });
});
