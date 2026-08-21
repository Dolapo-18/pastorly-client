import { prayerGroups } from "@/features/prayer/prayer-hub.data";

export const scheduleOptions = {
  group: prayerGroups.map((group) => group.name),
  date: [
    "Thu, 15 May 2025",
    "Fri, 16 May 2025",
    "Sat, 17 May 2025",
    "Sun, 18 May 2025",
  ],
  time: ["05:30 AM", "06:00 AM", "12:00 PM", "06:00 PM", "07:00 PM"],
  duration: ["30 minutes", "45 minutes", "60 minutes", "90 minutes"],
  repeat: ["Does not repeat", "Daily", "Weekly", "Monthly"],
  reminder: [
    "No reminder",
    "15 minutes before",
    "30 minutes before",
    "1 hour before",
  ],
} as const;
