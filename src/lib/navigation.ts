import { router, type Href } from "expo-router";

/**
 * Pops the stack when there is history, otherwise navigates to `fallbackHref`.
 * Screens opened from a deep link or notification have no history to pop, so
 * without a fallback the user would be stranded.
 */
export function goBackOr(fallbackHref: Href) {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(fallbackHref);
}
