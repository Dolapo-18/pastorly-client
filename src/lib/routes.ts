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
} as const;
