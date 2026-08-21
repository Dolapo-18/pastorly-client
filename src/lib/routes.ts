import type { Href } from "expo-router";

/**
 * Placeholder destination for actions whose screen is not built yet.
 * Keeps every button responsive instead of silently doing nothing.
 */
export function comingSoon(title: string, screen?: number): Href {
  return {
    pathname: "/(app)/coming-soon",
    params: screen ? { title, screen: String(screen) } : { title },
  };
}

export const routes = {
  welcome: "/(auth)/welcome",
  login: "/(auth)/login",
  signup: "/(auth)/signup",
  roleSelect: "/(auth)/role-select",
  dashboard: "/(app)/dashboard",
  onboarding: "/(app)/onboarding",
  onboardingJoin: "/(app)/onboarding/join-church",
  onboardingDiscover: "/(app)/onboarding/discover",
  onboardingSetup: "/(app)/onboarding/setup-branch",
  setupBranchPending: "/(app)/onboarding/setup-branch/pending",
  accountProfile: "/(app)/account/profile",
  myBranches: "/(app)/account/branches",
  forgotPassword: "/(auth)/forgot-password",
  resetPassword: (email: string): Href => ({
    pathname: "/(auth)/forgot-password/reset",
    params: { email },
  }),
  pastorHome: "/(app)/pastor/(tabs)/home",
  pastorCalendar: "/(app)/pastor/(tabs)/calendar",
  pastorGroups: "/(app)/pastor/(tabs)/groups",
  pastorProfile: "/(app)/pastor/(tabs)/profile",
  prayerHub: "/(app)/pastor/(tabs)/prayer",
  createGroup: "/(app)/pastor/create-group",
  scheduleMeeting: "/(app)/pastor/schedule-meeting",
  groupDetails: (id: string): Href => ({
    pathname: "/(app)/pastor/group/[id]",
    params: { id },
  }),
  branchDetail: (slug: string): Href => ({
    pathname: "/(app)/onboarding/branch/[slug]",
    params: { slug },
  }),
} as const;
