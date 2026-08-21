import type { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import { accents } from "@/constants/theme";
import { prayerGroups } from "@/features/prayer/prayer-hub.data";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export const GROUP_DETAIL_TABS = [
  "Overview",
  "Members",
  "Points",
  "Testimonies",
] as const;

export type GroupDetailTab = (typeof GROUP_DETAIL_TABS)[number];

export type GroupOverviewRow = {
  id: string;
  icon: IconName;
  tint: string;
  label: string;
  subtitle?: string;
  value?: string;
};

export type GroupDetails = {
  id: string;
  name: string;
  icon: IconName;
  tint: string;
  memberCount: number;
  status: string;
  memberInitials: string[];
  overview: GroupOverviewRow[];
};

/** Placeholder detail payload until the Pastorly API is wired up. */
export function getGroupDetails(id: string): GroupDetails {
  const group =
    prayerGroups.find((candidate) => candidate.id === id) ?? prayerGroups[0];

  return {
    id: group.id,
    name: group.name,
    icon: group.icon,
    tint: group.tint,
    memberCount: group.memberCount,
    status: "Active",
    memberInitials: ["AO", "BN", "CE", "DK", "FT"],
    overview: [
      {
        id: "next-session",
        icon: "calendar-clock",
        tint: accents.purple,
        label: "Next Session",
        subtitle: `${group.nextSession}`,
        value: "in 2h 15m",
      },
      {
        id: "active-requests",
        icon: "account-heart-outline",
        tint: accents.teal,
        label: "Active Requests",
        value: "7",
      },
      {
        id: "prayer-points",
        icon: "bookmark-multiple-outline",
        tint: accents.purple,
        label: "Prayer Points",
        value: "4",
      },
      {
        id: "answered-prayers",
        icon: "hand-heart-outline",
        tint: accents.amber,
        label: "Answered Prayers",
        value: "12",
      },
    ],
  };
}
