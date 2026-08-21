import { Redirect, Stack } from "expo-router";

import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuthStore } from "@/store/auth.store";

/**
 * Authenticated shell — pastor/member tabs and pushed screens.
 * Redirects to welcome when there is no active session.
 */
export default function AuthenticatedLayout() {
  const { colors } = useAppTheme();
  const status = useAuthStore((state) => state.status);

  if (status === "unauthenticated") {
    return <Redirect href="/(auth)/welcome" />;
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
