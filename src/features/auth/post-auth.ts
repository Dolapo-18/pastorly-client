import type { Href } from "expo-router";

import { homeForRole } from "@/features/auth/navigation";
import type { UserRole } from "@/store/auth.store";

/** Where authenticated users land based on branch membership. */
export function postAuthHref(
  hasActiveBranches: boolean,
  role: UserRole,
): Href {
  if (!hasActiveBranches) {
    return "/(app)/onboarding";
  }
  if (role) {
    return homeForRole(role);
  }
  return "/(app)/onboarding";
}

export function isOnboardingExemptPath(segments: readonly string[]): boolean {
  return (
    segments.includes("onboarding") ||
    segments.includes("account") ||
    segments.includes("coming-soon")
  );
}
