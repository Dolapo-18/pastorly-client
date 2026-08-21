import {
  filterBranchCatalog,
  resolveOrganizationName,
  setDynamicBranchCache,
} from "@/lib/branches";
import { appStorage, storageKeys } from "@/lib/storage";
import { MOCK_BRANCH_CATALOG, MFM_ORGANIZATION } from "@/mocks/fixtures/branches";
import { authService } from "@/services/auth.service";
import { membershipService } from "@/services/membership.service";
import type { BranchService } from "@/types/api";
import type {
  Branch,
  BranchSetupRequest,
  CreateBranchSetupPayload,
} from "@/types/branch";

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

async function readSetupRequests(): Promise<BranchSetupRequest[]> {
  const raw = await appStorage.getItem(storageKeys.setupRequests);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as BranchSetupRequest[];
  } catch {
    return [];
  }
}

async function writeSetupRequests(requests: BranchSetupRequest[]) {
  await appStorage.setItem(storageKeys.setupRequests, JSON.stringify(requests));
}

async function readDynamicBranches(): Promise<Branch[]> {
  const raw = await appStorage.getItem(storageKeys.dynamicBranches);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Branch[];
  } catch {
    return [];
  }
}

async function writeDynamicBranches(branches: Branch[]) {
  await appStorage.setItem(storageKeys.dynamicBranches, JSON.stringify(branches));
  setDynamicBranchCache(branches);
}

async function getFullCatalog(): Promise<Branch[]> {
  const dynamic = await readDynamicBranches();
  setDynamicBranchCache(dynamic);
  return [...MOCK_BRANCH_CATALOG, ...dynamic];
}

async function currentUserId(): Promise<string | null> {
  const session = await authService.getSession();
  return session?.user.id ?? null;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
    const catalog = await getFullCatalog();
    const normalized = slug.trim().toLowerCase();
    return (
      catalog.find((item) => item.slug.toLowerCase() === normalized) ?? null
    );
  },

  async searchBranches(query: string, organizationId?: string) {
    await delay(120);
    const catalog = await getFullCatalog();
    return filterBranchCatalog(catalog, query, organizationId);
  },

  async joinBranch(branchId: string) {
    await delay(150);
    return membershipService.joinBranch(branchId);
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

  async submitBranchSetup(payload: CreateBranchSetupPayload) {
    await delay(300);
    const userId = await currentUserId();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    if (
      !payload.organizationId.trim() ||
      !payload.branchName.trim() ||
      !payload.city.trim() ||
      !payload.country.trim() ||
      !payload.pastorName.trim() ||
      !payload.email.trim()
    ) {
      throw new Error("Complete all required fields before submitting");
    }

    const requests = await readSetupRequests();
    const existingPending = requests.find(
      (item) => item.submitterId === userId && item.status === "pending",
    );
    if (existingPending) {
      throw new Error("You already have a branch setup request under review");
    }

    const request: BranchSetupRequest = {
      id: `setup_${Date.now()}`,
      organizationId: payload.organizationId,
      submitterId: userId,
      branchName: payload.branchName.trim(),
      city: payload.city.trim(),
      country: payload.country.trim(),
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    requests.push(request);
    await writeSetupRequests(requests);
    void payload.address;
    void payload.phone;

    return { requestId: request.id };
  },

  async getMySetupRequests() {
    await delay(80);
    const userId = await currentUserId();
    if (!userId) return [];
    const requests = await readSetupRequests();
    return requests.filter((item) => item.submitterId === userId);
  },

  async getPendingSetupRequest() {
    await delay(80);
    const userId = await currentUserId();
    if (!userId) return null;
    const requests = await readSetupRequests();
    return (
      requests.find(
        (item) => item.submitterId === userId && item.status === "pending",
      ) ?? null
    );
  },
};

export const branchServiceDev = {
  activeBranchKey: storageKeys.activeBranch,
  setupRequestsKey: storageKeys.setupRequests,
  clearActiveBranch: async (userId: string) => {
    const map = await readActiveBranchMap();
    delete map[userId];
    await writeActiveBranchMap(map);
  },
  approveSetupRequest: async (requestId: string) => {
    const requests = await readSetupRequests();
    const index = requests.findIndex((item) => item.id === requestId);
    if (index === -1) {
      throw new Error("Setup request not found");
    }

    const request = requests[index];
    if (request.status !== "pending") {
      throw new Error("Only pending requests can be approved");
    }

    const branchId = `branch_${Date.now()}`;
    const branch: Branch = {
      id: branchId,
      organizationId: request.organizationId,
      name: request.branchName,
      slug: slugify(request.branchName),
      city: request.city,
      country: request.country,
      joinPolicy: "approval_required",
    };

    const dynamic = await readDynamicBranches();
    dynamic.push(branch);
    await writeDynamicBranches(dynamic);

    await membershipService.createBranchAdminMembership(branchId);

    requests[index] = {
      ...request,
      status: "approved",
      reviewedAt: new Date().toISOString(),
    };
    await writeSetupRequests(requests);

    const userId = request.submitterId;
    const map = await readActiveBranchMap();
    map[userId] = branchId;
    await writeActiveBranchMap(map);

    return { request: requests[index], branch };
  },
  rejectSetupRequest: async (requestId: string, reason: string) => {
    const requests = await readSetupRequests();
    const index = requests.findIndex((item) => item.id === requestId);
    if (index === -1) {
      throw new Error("Setup request not found");
    }

    requests[index] = {
      ...requests[index],
      status: "rejected",
      reviewedAt: new Date().toISOString(),
      rejectionReason: reason.trim() || "Request declined",
    };
    await writeSetupRequests(requests);
    return requests[index];
  },
  organizationNames: {
    [MFM_ORGANIZATION.id]: MFM_ORGANIZATION.name,
    org_independent: "Independent church network",
  },
  resolveOrganizationName,
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
