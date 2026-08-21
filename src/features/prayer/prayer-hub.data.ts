import type { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import { accents } from "@/constants/theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export const PRAYER_HUB_FILTERS = [
  "All",
  "Groups",
  "Rooms",
  "Requests",
] as const;

export type PrayerHubFilter = (typeof PRAYER_HUB_FILTERS)[number];

export type PrayerGroup = {
  id: string;
  name: string;
  icon: IconName;
  tint: string;
  memberCount: number;
  nextSession: string;
  badgeCount: number;
};

/** Placeholder groups until the Pastorly API is wired up. */
export const prayerGroups: PrayerGroup[] = [
  {
    id: "job-seekers",
    name: "Job Seekers",
    icon: "briefcase",
    tint: accents.purple,
    memberCount: 12,
    nextSession: "Friday, 7:00 PM",
    badgeCount: 3,
  },
  {
    id: "fruit-of-the-womb",
    name: "Fruit of the Womb",
    icon: "sprout",
    tint: accents.pink,
    memberCount: 22,
    nextSession: "Thu, 6:00 AM",
    badgeCount: 2,
  },
  {
    id: "healing",
    name: "Healing",
    icon: "cross",
    tint: accents.teal,
    memberCount: 30,
    nextSession: "Sat, 7:00 PM",
    badgeCount: 4,
  },
  {
    id: "marriage",
    name: "Marriage",
    icon: "heart",
    tint: accents.crimson,
    memberCount: 18,
    nextSession: "Sun, 4:00 AM",
    badgeCount: 1,
  },
];
