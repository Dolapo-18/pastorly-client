import type { Href } from "expo-router";

import type { UserRole } from "@/store/auth.store";

export function homeForRole(role: NonNullable<UserRole>): Href {
  if (role === "pastor") return "/(app)/pastor/(tabs)/home";
  return "/(app)/member/(tabs)/home";
}

export function destinationForRole(role: NonNullable<UserRole>, returnTo?: string) {
  if (returnTo) return returnTo;
  return homeForRole(role);
}
