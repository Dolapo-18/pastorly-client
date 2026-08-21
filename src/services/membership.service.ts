import type { BranchMembership } from "@/types/branch";
import type { MembershipService } from "@/types/api";
import { authService } from "@/services/auth.service";
import {
  INVITE_CODES,
  MOCK_BRANCH_CATALOG,
} from "@/mocks/fixtures/branches";
import {
  demoMembershipsForUser,
  isDemoAccountEmail,
} from "@/mocks/fixtures/memberships";
import { appStorage, storageKeys } from "@/lib/storage";

type MembershipMap = Record<string, BranchMembership[]>;

async function readAll(): Promise<MembershipMap> {
  const raw = await appStorage.getItem(storageKeys.memberships);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as MembershipMap;
  } catch {
    return {};
  }
}

async function writeAll(map: MembershipMap) {
  await appStorage.setItem(storageKeys.memberships, JSON.stringify(map));
}

async function currentUserId(): Promise<string | null> {
  const session = await authService.getSession();
  return session?.user.id ?? null;
}

async function seedDemoIfNeeded(userId: string, email: string) {
  if (!isDemoAccountEmail(email)) return;
  const all = await readAll();
  if (all[userId]?.length) return;
  all[userId] = demoMembershipsForUser(userId);
  await writeAll(all);
}

export const membershipService: MembershipService = {
  async getMyBranches() {
    const session = await authService.getSession();
    if (!session) return [];

    await seedDemoIfNeeded(session.user.id, session.user.email);
    const all = await readAll();
    return all[session.user.id] ?? [];
  },

  async joinByInviteCode(code: string) {
    await delay(250);
    const userId = await currentUserId();
    if (!userId) throw new Error("Not authenticated");

    const normalized = code.trim().toUpperCase();
    const branchId = INVITE_CODES[normalized];
    if (!branchId) {
      throw new Error("Invalid invitation code");
    }

    const branch = MOCK_BRANCH_CATALOG.find((item) => item.id === branchId);
    if (!branch) {
      throw new Error("Branch not found");
    }

    const all = await readAll();
    const existing = all[userId] ?? [];
    if (existing.some((item) => item.branchId === branchId && item.status !== "left")) {
      throw new Error("You already belong to this branch");
    }

    const membership: BranchMembership = {
      id: `mem_${Date.now()}`,
      userId,
      branchId,
      role: "member",
      status: branch.joinPolicy === "open" ? "active" : "pending",
      joinedAt: new Date().toISOString(),
    };

    all[userId] = [...existing, membership];
    await writeAll(all);
    return membership;
  },

  async createPastorBranch({ churchName, city, country }) {
    await delay(300);
    const session = await authService.getSession();
    if (!session) throw new Error("Not authenticated");

    const userId = session.user.id;
    const branchId = `branch_${Date.now()}`;
    const membership: BranchMembership = {
      id: `mem_${Date.now()}`,
      userId,
      branchId,
      role: "branch_admin",
      status: "active",
      joinedAt: new Date().toISOString(),
    };

    const all = await readAll();
    all[userId] = [...(all[userId] ?? []), membership];
    await writeAll(all);

    // Branch metadata is mock-only until Sprint 2 catalogue sync.
    void city;
    void country;
    void churchName;

    return membership;
  },

  async clearForUser(userId: string) {
    const all = await readAll();
    delete all[userId];
    await writeAll(all);
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
