import { useBranchStore } from "@/store/branch.store";

export function useMyBranches() {
  const myBranches = useBranchStore((state) => state.myBranches);
  const status = useBranchStore((state) => state.status);

  return {
    myBranches,
    status,
    isReady: status === "ready",
    hasMultiple: myBranches.length > 1,
  };
}
