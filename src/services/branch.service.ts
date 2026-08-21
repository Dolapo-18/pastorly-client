import type { BranchService } from "@/types/api";

/**
 * Mock branch service — stub until Sprint 2.
 * All methods reject or return empty data so callers fail loudly during development.
 */
export const branchService: BranchService = {
  async getMyBranches() {
    await delay(100);
    return [];
  },

  async setActiveBranch(_branchId: string) {
    await delay(100);
    throw new Error("branchService.setActiveBranch — not implemented until Sprint 2");
  },

  async getBranchBySlug(_slug: string) {
    await delay(100);
    return null;
  },

  async joinBranch(_branchId: string) {
    await delay(100);
    throw new Error("branchService.joinBranch — not implemented until Sprint 4");
  },

  async leaveBranch(_branchId: string) {
    await delay(100);
    throw new Error("branchService.leaveBranch — not implemented until Sprint 3");
  },

  async submitBranchSetup(_payload) {
    await delay(100);
    throw new Error("branchService.submitBranchSetup — not implemented until Sprint 5");
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
