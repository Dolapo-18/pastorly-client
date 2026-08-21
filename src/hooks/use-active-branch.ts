import { useBranchStore } from "@/store/branch.store";

export function useActiveBranch() {
  const activeBranch = useBranchStore((state) => state.activeBranch);
  const activeBranchId = useBranchStore((state) => state.activeBranchId);
  const activeMembership = useBranchStore((state) => state.activeMembership);
  const roleAtActiveBranch = useBranchStore((state) => state.roleAtActiveBranch);
  const setActiveBranch = useBranchStore((state) => state.setActiveBranch);
  const status = useBranchStore((state) => state.status);

  return {
    activeBranch,
    activeBranchId,
    activeMembership,
    roleAtActiveBranch,
    setActiveBranch,
    status,
    isReady: status === "ready",
  };
}
