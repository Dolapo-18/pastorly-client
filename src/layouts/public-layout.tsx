import { Redirect, Stack } from "expo-router";

import { homeForRole } from "@/features/auth";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuthStore } from "@/store/auth.store";

/**
 * Unauthenticated shell — welcome, login, signup, onboarding.
 * Redirects to the role home when a session is already active.
 */
export default function PublicLayout() {
  const { colors } = useAppTheme();
  const status = useAuthStore((state) => state.status);
  const role = useAuthStore((state) => state.role);

  if (status === "authenticated" && role) {
    return <Redirect href={homeForRole(role)} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    />
  );
}
