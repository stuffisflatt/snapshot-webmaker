// Cache headers for the static media. Without them Vercel serves every file with max-age=0, so a
// phone re-checks each of the story's 74 frames with the server while scrolling, which lags.
// Media file names are not content-hashed: after replacing a file, give it a new name (or accept
// that visitors may keep the old one for up to a day).
export default {
  routeRules: {
    "/media/story-frames/**": { headers: { "cache-control": "public, max-age=604800, stale-while-revalidate=86400" } },
    "/media/**": { headers: { "cache-control": "public, max-age=86400, stale-while-revalidate=604800" } },
  },
};
