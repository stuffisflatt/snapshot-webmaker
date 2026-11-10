// All original frames from the first clip, spread continuously over 01–03.
export const STORY_FRAME_COUNT = 107;
export const STORY_STILLS = ["/media/story-single/001.webp", "/media/story-single/054.webp", "/media/story-single/107.webp"] as const;
export const STORY_PHONE_FRAME_COUNT = STORY_FRAME_COUNT;
export const STORY_PHONE_STILLS = STORY_STILLS;
export type StoryLayer = { src: string; opacity: number };
export function storyLayers(progress: number, reducedMotion = false, _phone = false): StoryLayer[] {
  const p = Math.min(1, Math.max(0, progress));
  if (reducedMotion) return [{ src: STORY_STILLS[p < .3 ? 0 : p < .7 ? 1 : 2], opacity: 1 }];
  const frame = p * (STORY_FRAME_COUNT - 1);
  const base = Math.floor(frame);
  const src = (i: number) => `/media/story-single/${String(i + 1).padStart(3, "0")}.webp`;
  if (base === STORY_FRAME_COUNT - 1 || frame === base) return [{ src: src(base), opacity: 1 }];
  return [{ src: src(base), opacity: 1 }, { src: src(base + 1), opacity: frame - base }];
}

/** Stills cut from story.mp4 (every second frame), used on touch screens instead of scrubbing video. */
export const STORY_VIDEO_FRAMES = 74;
export const storyFrameSrc = (index: number) => `/media/story-frames/${String(index + 1).padStart(3, "0")}.webp`;
/** Scroll progress (0..1) to the still that shows it; the whole range spans first to last frame. */
export function storyFrameIndex(progress: number, count = STORY_VIDEO_FRAMES) {
  const p = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
  return Math.round(p * (count - 1));
}
