import { Redirect } from "expo-router";

import { postAuthHref } from "@/features/auth";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardScreen() {
  const role = useAuthStore((state) => state.role);
  const hasActiveBranches = useAuthStore((state) => state.hasActiveBranches);

  return <Redirect href={postAuthHref(hasActiveBranches, role)} />;
}
