import { Redirect, Stack, useSegments } from "expo-router";

import { postAuthHref, isOnboardingExemptPath } from "@/features/auth";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuthStore } from "@/store/auth.store";

export default function AuthenticatedLayout() {
  const { colors } = useAppTheme();
  const segments = useSegments();
  const status = useAuthStore((state) => state.status);
  const role = useAuthStore((state) => state.role);
  const hasActiveBranches = useAuthStore((state) => state.hasActiveBranches);

  if (status === "unauthenticated") {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (
    status === "authenticated" &&
    !hasActiveBranches &&
    !isOnboardingExemptPath(segments)
  ) {
    return <Redirect href="/(app)/onboarding" />;
  }

  if (
    status === "authenticated" &&
    hasActiveBranches &&
    (segments as readonly string[]).includes("onboarding")
  ) {
    return <Redirect href={postAuthHref(true, role)} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="pastor/create-group"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
