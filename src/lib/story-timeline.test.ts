import { describe, expect, it } from "vitest";
import { STORY_STILLS, STORY_FRAME_COUNT, storyLayers } from "./story-timeline";

describe("single clip scroll sequence", () => {
  it("uses every original frame of the first clip across the full section", () => {
    expect(STORY_FRAME_COUNT).toBe(107);
    const frames = new Set<string>();
    for (let i = 0; i < STORY_FRAME_COUNT; i++) {
      for (const layer of storyLayers(i / (STORY_FRAME_COUNT - 1))) frames.add(layer.src);
    }
    expect(frames.size).toBe(107);
    for (const src of frames) expect(src).toContain('/media/story-single/');
    expect(storyLayers(0)).toEqual([{src: STORY_STILLS[0], opacity: 1}]);
    expect(storyLayers(.5)).toEqual([{src: STORY_STILLS[1], opacity: 1}]);
    expect(storyLayers(1)).toEqual([{src: STORY_STILLS[2], opacity: 1}]);
  });
  it("blends adjacent frames continuously and reverses deterministically", () => {
    for (let i = 0; i <= 1000; i++) {
      const layers = storyLayers(i / 1000);
      expect(layers.length).toBeLessThanOrEqual(2);
      for (const layer of layers) {
        expect(layer.opacity).toBeGreaterThanOrEqual(0);
        expect(layer.opacity).toBeLessThanOrEqual(1);
      }
      if (layers.length === 2) expect(Number(layers[1]!.src.match(/(\d+)\.webp$/)![1]) - Number(layers[0]!.src.match(/(\d+)\.webp$/)![1])).toBe(1);
    }
    const points = [.1, .25, .5, .75, .9];
    expect([...points].reverse().map(p=>storyLayers(p)).reverse()).toEqual(points.map(p=>storyLayers(p)));
  });
  it("uses still frames for reduced motion and clamps endpoints", () => {
    expect(storyLayers(-1)).toEqual(storyLayers(0));
    expect(storyLayers(2)).toEqual(storyLayers(1));
    expect(storyLayers(.5, true)).toEqual([{src: STORY_STILLS[1], opacity: 1}]);
  });
});

import { STORY_VIDEO_FRAMES, storyFrameIndex, storyFrameSrc } from "./story-timeline";

describe("story stills on touch screens", () => {
  it("maps the scroll range onto first through last frame", () => {
    expect(storyFrameIndex(0)).toBe(0);
    expect(storyFrameIndex(1)).toBe(STORY_VIDEO_FRAMES - 1);
    expect(storyFrameIndex(.5)).toBe(Math.round(.5 * (STORY_VIDEO_FRAMES - 1)));
  });
  it("clamps out-of-range and invalid progress", () => {
    expect(storyFrameIndex(-1)).toBe(0);
    expect(storyFrameIndex(2)).toBe(STORY_VIDEO_FRAMES - 1);
    expect(storyFrameIndex(Number.NaN)).toBe(0);
  });
  it("names frames 001..074", () => {
    expect(storyFrameSrc(0)).toBe("/media/story-frames/001.webp");
    expect(storyFrameSrc(STORY_VIDEO_FRAMES - 1)).toBe("/media/story-frames/074.webp");
  });
});
