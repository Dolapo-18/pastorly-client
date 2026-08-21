/**
 * Re-exports static feature mock data.
 * New fixtures belong in `src/mocks/fixtures/`; migrate legacy files here over time.
 */
export {
  dailyScripture,
  greetingForHour,
  pastorDashboardStats,
  pastorProfile,
} from "@/features/dashboard/pastor-dashboard.data";

export {
  PRAYER_HUB_FILTERS,
  prayerGroups,
  type PrayerGroup,
  type PrayerHubFilter,
} from "@/features/prayer/prayer-hub.data";

export {
  GROUP_DETAIL_TABS,
  getGroupDetails,
  type GroupDetailTab,
  type GroupDetails,
} from "@/features/prayer/group-details.data";

export { scheduleOptions } from "@/features/prayer/schedule-meeting.data";

export { MFM_ORGANIZATION, MOCK_BRANCH_CATALOG, INVITE_CODES, DEMO_USER_EMAIL } from "@/mocks/fixtures/branches";
export { demoMembershipsForUser, isDemoAccountEmail } from "@/mocks/fixtures/memberships";
