import { Redirect, Stack, useSegments } from "expo-router";

import { postAuthHref, isOnboardingExemptPath } from "@/features/auth";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuthStore } from "@/store/auth.store";

export default function PublicLayout() {
  const { colors } = useAppTheme();
  const status = useAuthStore((state) => state.status);
  const role = useAuthStore((state) => state.role);
  const hasActiveBranches = useAuthStore((state) => state.hasActiveBranches);

  if (status === "authenticated") {
    return (
      <Redirect href={postAuthHref(hasActiveBranches, role)} />
    );
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
