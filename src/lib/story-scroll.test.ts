import { describe, expect, it } from "vitest";
import { storyScrollDelta } from "./story-scroll";

describe("continuous story scrolling", () => {
  it("preserves small native wheel movement", () => {
    for (const delta of [-120, -.5, .5, 120]) expect(storyScrollDelta(1800, delta, 1000, 2800, 1000)).toBe(delta);
  });
  it("limits a burst entering from either direction without skipping the story", () => {
    expect(900 + storyScrollDelta(900, 10000, 1000, 2800, 1000)).toBe(1400);
    expect(2900 + storyScrollDelta(2900, -10000, 1000, 2800, 1000)).toBe(2400);
  });
  it("exits in both directions even a fraction of a pixel from the boundary", () => {
    for (const distance of [.1, .5, 1, 2, 3]) {
      const bottom = 2800 - distance;
      expect(bottom + storyScrollDelta(bottom, 120, 1000, 2800, 1000)).toBeGreaterThan(2800);
      const top = 1000 + distance;
      expect(top + storyScrollDelta(top, -120, 1000, 2800, 1000)).toBeLessThan(1000);
    }
  });
  it("cannot trap repeated hard scrolling or reverse scrolling", () => {
    let y = 900;
    for (let i = 0; i < 10; i++) y += storyScrollDelta(y, 1000, 1000, 2800, 1000);
    expect(y).toBeGreaterThan(2800);
    for (let i = 0; i < 20; i++) y += storyScrollDelta(y, -1000, 1000, 2800, 1000);
    expect(y).toBeLessThan(1000);
  });
});
