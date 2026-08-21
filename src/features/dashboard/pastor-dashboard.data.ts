import type { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import type { ComponentProps } from "react";

import { accents } from "@/constants/theme";
import { comingSoon, routes } from "@/lib/routes";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export type DashboardStat = {
  id: string;
  icon: IconName;
  tint: string;
  value: string;
  label: string;
  href: Href;
};

/** Placeholder figures until the Pastorly API is wired up. */
export const pastorDashboardStats: DashboardStat[] = [
  {
    id: "prayer-requests",
    icon: "hands-pray",
    tint: accents.coral,
    value: "138",
    label: "Prayer Requests",
    href: routes.prayerHub,
  },
  {
    id: "active-rooms",
    icon: "forum-outline",
    tint: accents.purple,
    value: "4",
    label: "Active Rooms",
    href: comingSoon("Active Prayer Rooms", 11),
  },
  {
    id: "upcoming-sessions",
    icon: "calendar-clock",
    tint: accents.purple,
    value: "6",
    label: "Upcoming Sessions",
    href: routes.pastorCalendar,
  },
  {
    id: "follow-ups",
    icon: "account-clock-outline",
    tint: accents.purple,
    value: "12",
    label: "Members to Follow Up",
    href: comingSoon("Members to Follow Up", 19),
  },
  {
    id: "todays-points",
    icon: "bookmark-outline",
    tint: accents.amber,
    value: "8",
    label: "Today's Points",
    href: comingSoon("Today's Prayer Points", 14),
  },
  {
    id: "answered-prayers",
    icon: "check-decagram-outline",
    tint: accents.green,
    value: "23",
    label: "Answered Prayers",
    href: comingSoon("Answered Prayers", 16),
  },
];

export const pastorProfile = {
  name: "Pastor John",
  unreadNotifications: 3,
};

export const dailyScripture = {
  verse: "Be devoted to prayer; being watchful and thankful.",
  reference: "Colossians 4:2",
};

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning,";
  if (hour < 17) return "Good afternoon,";
  return "Good evening,";
}
