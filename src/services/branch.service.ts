import { appStorage, storageKeys } from "@/lib/storage";
import { MOCK_BRANCH_CATALOG } from "@/mocks/fixtures/branches";
import { authService } from "@/services/auth.service";
import { membershipService } from "@/services/membership.service";
import type { BranchService } from "@/types/api";

type ActiveBranchMap = Record<string, string>;

async function readActiveBranchMap(): Promise<ActiveBranchMap> {
  const raw = await appStorage.getItem(storageKeys.activeBranch);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ActiveBranchMap;
  } catch {
    return {};
  }
}

async function writeActiveBranchMap(map: ActiveBranchMap) {
  if (Object.keys(map).length === 0) {
    await appStorage.removeItem(storageKeys.activeBranch);
    return;
  }
  await appStorage.setItem(storageKeys.activeBranch, JSON.stringify(map));
}

async function currentUserId(): Promise<string | null> {
  const session = await authService.getSession();
  return session?.user.id ?? null;
}

export const branchService: BranchService = {
  async getMyBranches() {
    await delay(100);
    return membershipService.getMyBranches();
  },

  async getActiveBranchId() {
    await delay(50);
    const userId = await currentUserId();
    if (!userId) return null;
    const map = await readActiveBranchMap();
    return map[userId] ?? null;
  },

  async setActiveBranch(branchId: string) {
    await delay(100);
    const userId = await currentUserId();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const memberships = await membershipService.getMyBranches();
    const membership = memberships.find(
      (item) => item.branchId === branchId && item.status === "active",
    );
    if (!membership) {
      throw new Error("You do not have access to this branch");
    }

    const map = await readActiveBranchMap();
    map[userId] = branchId;
    await writeActiveBranchMap(map);
  },

  async getBranchBySlug(slug: string) {
    await delay(80);
    const normalized = slug.trim().toLowerCase();
    return (
      MOCK_BRANCH_CATALOG.find((item) => item.slug.toLowerCase() === normalized) ??
      null
    );
  },

  async joinBranch(_branchId: string) {
    await delay(100);
    throw new Error("branchService.joinBranch — not implemented until Sprint 4");
  },

  async leaveBranch(branchId: string) {
    await delay(200);
    const userId = await currentUserId();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await membershipService.leaveBranch(branchId);

    const map = await readActiveBranchMap();
    const activeId = map[userId] ?? null;
    if (activeId !== branchId) {
      return;
    }

    const memberships = await membershipService.getMyBranches();
    const fallback = memberships.find((item) => item.status === "active");

    if (fallback) {
      map[userId] = fallback.branchId;
      await writeActiveBranchMap(map);
      return;
    }

    delete map[userId];
    await writeActiveBranchMap(map);
  },

  async submitBranchSetup(_payload) {
    await delay(100);
    throw new Error("branchService.submitBranchSetup — not implemented until Sprint 5");
  },
};

export const branchServiceDev = {
  activeBranchKey: storageKeys.activeBranch,
  clearActiveBranch: async (userId: string) => {
    const map = await readActiveBranchMap();
    delete map[userId];
    await writeActiveBranchMap(map);
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
