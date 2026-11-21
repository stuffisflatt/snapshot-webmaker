import { useLayoutEffect } from "react";

// Going from the home page to a service page and back should feel like one place: the home page
// reopens at exactly the spot it was left, with no jump to the top and no scroll down to it.
const SPOT = "alphastom:home-scroll";
const RETURN = "alphastom:home-return";

const store = () => { try { return window.sessionStorage; } catch { return null; } };

/** Call when leaving the home page for a service page: remembers the scroll position. */
export function rememberHomeSpot() {
  store()?.setItem(SPOT, String(Math.round(window.scrollY)));
}

/** Call from a service page's back link: the home page will reopen at the remembered spot. */
export function markReturnHome() {
  store()?.setItem(RETURN, "1");
}

/**
 * Home page: before the first paint, jump straight to the remembered spot when arriving from a
 * service page's back link. (The browser's own Back button is handled by the router's scroll
 * restoration.)
 */
export function useReturnHome() {
  useLayoutEffect(() => {
    const s = store();
    if (!s || s.getItem(RETURN) !== "1") return;
    s.removeItem(RETURN);
    const y = Number(s.getItem(SPOT));
    if (Number.isFinite(y)) window.scrollTo({ top: y, behavior: "instant" });
  }, []);
}
