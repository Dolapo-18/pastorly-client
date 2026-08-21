import { router } from "expo-router";

import { routes } from "@/lib/routes";
import { useAuthStore } from "@/store/auth.store";
import { useBranchStore } from "@/store/branch.store";

/** Switch active branch and re-route to the correct home shell. */
export async function switchActiveBranch(branchId: string) {
  await useBranchStore.getState().setActiveBranch(branchId);
  useAuthStore.setState({
    role: useBranchStore.getState().roleAtActiveBranch,
  });
  router.replace(routes.dashboard);
}
