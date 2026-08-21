import { router } from "expo-router";

import { homeForRole } from "@/features/auth";
import { roleFromMembership } from "@/lib/branches";
import { routes } from "@/lib/routes";
import type { BranchMembership } from "@/types/branch";

type RefreshMemberships = () => Promise<void>;

/** Shared post-join navigation for invite and discover flows. */
export async function completeJoinFlow(
  membership: BranchMembership,
  refreshMemberships: RefreshMemberships,
) {
  await refreshMemberships();

  if (membership.status === "active") {
    const role = roleFromMembership(membership) ?? "member";
    router.replace(homeForRole(role));
    return "active" as const;
  }

  return "pending" as const;
}

export function goToOnboardingAfterPending() {
  router.replace(routes.onboarding);
}
