import { describe, expect, it } from "vitest";
import { cardOffset, cardShape, PITCH, roundedQuadPath } from "./curved-carousel";

describe("cardShape", () => {
  it("is an upright 170×280 rectangle at the centre", () => {
    const { width, corners } = cardShape(0);
    expect(width).toBe(170);
    expect(corners[3].y - corners[0].y).toBeCloseTo(280, 0);
    expect(corners[2].y - corners[1].y).toBeCloseTo(280, 0);
  });

  it("widens and grows toward the edges, outer edge taller than inner", () => {
    const { width, corners } = cardShape(5.5 * PITCH);
    const inner = corners[3].y - corners[0].y, outer = corners[2].y - corners[1].y;
    expect(width).toBeGreaterThan(200);
    expect(outer).toBeGreaterThan(inner);
    expect(outer).toBeGreaterThan(340);
  });

  it("keeps a visible gap between neighbours near the edge", () => {
    const a = cardShape(4 * PITCH), b = cardShape(5 * PITCH);
    expect(b.corners[0].x - a.corners[1].x).toBeGreaterThan(20);
  });
});

describe("loop", () => {
  it("wraps offsets into one loop length", () => {
    expect(cardOffset(0, 0, 12)).toBe(0);
    expect(cardOffset(11, 0, 12)).toBe(-PITCH);
    expect(cardOffset(0, -6 * PITCH - 1, 12)).toBeCloseTo(6 * PITCH - 1);
  });

  it("draws a closed rounded path", () => {
    const path = roundedQuadPath(cardShape(0).corners, 15);
    expect(path.startsWith("M")).toBe(true);
    expect(path.endsWith("Z")).toBe(true);
    expect(path.match(/Q/g)?.length).toBe(4);
  });
});
