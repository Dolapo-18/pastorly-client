import { Redirect } from "expo-router";

import { homeForRole } from "@/features/auth";
import { useAuthStore } from "@/store/auth.store";

/** Canonical post-auth entry — resolves to the role-specific home tab. */
export default function DashboardScreen() {
  const role = useAuthStore((state) => state.role);

  if (!role) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Redirect href={homeForRole(role)} />;
}
