import { describe, expect, it } from "vitest";
import { activeStep, barWeight, photoRise, rise, sceneProgress, stepLine, videoFrame, VIDEO_FRAMES } from "./story-motion";

describe("scroll-driven video frame", () => {
  it("starts on step 01", () => {
    expect(videoFrame(0)).toEqual(VIDEO_FRAMES[0]);
    expect(stepLine(0, 0, 0).y).toBe(0);
  });
  it("rests on each pose between moves", () => {
    expect(videoFrame(.48).scale).toBeCloseTo(VIDEO_FRAMES[1].scale);
    expect(videoFrame(.8).aspect).toBeCloseTo(VIDEO_FRAMES[2].aspect);
    expect(videoFrame(1).scale).toBeCloseTo(VIDEO_FRAMES[3].scale);
  });
  it("has no jump between neighbouring scroll positions", () => {
    for (let p = 0; p < 1; p += .01) expect(Math.abs(videoFrame(p + .01).aspect - videoFrame(p).aspect)).toBeLessThan(.03);
  });
  it("returns the same frame when scrolling back to a position", () => {
    const frame = videoFrame(.375);
    videoFrame(.9);
    expect(videoFrame(.375)).toEqual(frame);
  });
  it("shows scenes 01, 02 and 03 at their corresponding positions", () => {
    expect([.25, .5, .75].map(p => activeStep(sceneProgress(p)))).toEqual([0, 1, 2]);
  });
});

describe("rise", () => {
  it("starts a full travel away and ends exactly at rest", () => {
    expect(rise(0).y).toBe(1);
    expect(rise(1)).toEqual({ y: 0, scaleX: 1, scaleY: 1, opacity: 1 });
  });

  it("stretches while moving and stays within a subtle ~3%", () => {
    const moving = rise(0.15);
    expect(moving.scaleY).toBeGreaterThan(1);
    expect(moving.scaleX).toBeLessThan(1);
    for (let t = 0; t <= 1; t += 0.02) expect(Math.abs(rise(t).scaleY - 1)).toBeLessThan(0.04);
  });

  it("overshoots a little and squashes as it settles", () => {
    const settling = rise(0.85);
    expect(settling.y).toBeLessThan(0);
    expect(settling.scaleY).toBeLessThan(1);
  });
});

describe("photos", () => {
  it("arrive one after another across the section", () => {
    expect(photoRise(0, 0.2).y).toBe(0);
    expect(photoRise(1, 0.2).y).toBe(1);
    expect(photoRise(2, 0.95).y).toBe(0);
  });
});

describe("step text", () => {
  it("shows one step at a time", () => {
    expect([0, 1, 2].map(s => stepLine(s, 1, 0.5).y)).toEqual([expect.any(Number), 0, 1.6]);
    expect(stepLine(0, 1, 0.5).y).toBeLessThan(-1.2);
    expect(activeStep(0.1)).toBe(0);
    expect(activeStep(0.5)).toBe(1);
    expect(activeStep(0.9)).toBe(2);
  });

  it("lights one progress bar per step", () => {
    expect([0, 1, 2].map(s => barWeight(s, 0.5))).toEqual([0, 1, 0]);
  });

  it("drops movement under reduced motion", () => {
    expect(stepLine(1, 0, 0.4, true).y).toBe(0);
    expect(rise(0.3, true)).toMatchObject({ y: 0, scaleY: 1 });
  });
});

describe("frame tabs", () => {
  it("grow from nothing to full in photo order, with a little overshoot on the way", async () => {
    const { frameTab } = await import("./story-motion");
    expect(frameTab(0, 0)).toBe(0);
    expect(frameTab(0, 0.3)).toBe(1);
    expect(frameTab(1, 0.2)).toBe(0);
    expect(Math.max(...Array.from({ length: 50 }, (_, i) => frameTab(0, i / 250)))).toBeGreaterThan(1);
  });
});
