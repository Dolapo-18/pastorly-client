import {
  roleFromMembership,
  toBranchEntries,
  type BranchEntry,
} from "@/lib/branches";
import { branchService } from "@/services/branch.service";
import type { UserRole } from "@/store/auth.store";
import type { Branch, BranchMembership } from "@/types/branch";
import { create } from "zustand";

type BranchStatus = "idle" | "loading" | "ready";

type BranchState = {
  status: BranchStatus;
  activeBranchId: string | null;
  activeBranch: Branch | null;
  activeMembership: BranchMembership | null;
  myBranches: BranchEntry[];
  roleAtActiveBranch: UserRole;
  sync: (memberships: BranchMembership[], userId: string) => Promise<void>;
  setActiveBranch: (branchId: string) => Promise<void>;
  clear: () => void;
};

const initialState = {
  status: "idle" as BranchStatus,
  activeBranchId: null,
  activeBranch: null,
  activeMembership: null,
  myBranches: [] as BranchEntry[],
  roleAtActiveBranch: null as UserRole,
};

function pickActiveBranchId(
  entries: BranchEntry[],
  persistedId: string | null,
): string | null {
  if (!entries.length) return null;
  if (persistedId && entries.some((item) => item.branch.id === persistedId)) {
    return persistedId;
  }
  return entries[0]?.branch.id ?? null;
}

export const useBranchStore = create<BranchState>((set, get) => ({
  ...initialState,

  sync: async (memberships, _userId) => {
    set({ status: "loading" });
    const entries = toBranchEntries(memberships);

    if (!entries.length) {
      set({ ...initialState, status: "ready" });
      return;
    }

    const persistedId = await branchService.getActiveBranchId();
    const activeBranchId = pickActiveBranchId(entries, persistedId);

    if (activeBranchId && activeBranchId !== persistedId) {
      await branchService.setActiveBranch(activeBranchId);
    }

    const activeEntry =
      entries.find((item) => item.branch.id === activeBranchId) ?? null;

    set({
      status: "ready",
      myBranches: entries,
      activeBranchId,
      activeBranch: activeEntry?.branch ?? null,
      activeMembership: activeEntry?.membership ?? null,
      roleAtActiveBranch: roleFromMembership(activeEntry?.membership),
    });
  },

  setActiveBranch: async (branchId) => {
    const { myBranches } = get();
    const entry = myBranches.find((item) => item.branch.id === branchId);
    if (!entry) {
      throw new Error("Branch is not in your active memberships");
    }

    await branchService.setActiveBranch(branchId);
    set({
      activeBranchId: branchId,
      activeBranch: entry.branch,
      activeMembership: entry.membership,
      roleAtActiveBranch: roleFromMembership(entry.membership),
    });
  },

  clear: () => {
    set(initialState);
  },
}));
