import { MFM_ORGANIZATION, MOCK_BRANCH_CATALOG } from "@/mocks/fixtures/branches";
import type { UserRole } from "@/store/auth.store";
import type { Branch, BranchMembership, MembershipStatus } from "@/types/branch";

let dynamicBranchCache: Branch[] = [];

export function setDynamicBranchCache(branches: Branch[]) {
  dynamicBranchCache = branches;
}

export function getCatalogBranches(): Branch[] {
  return [...MOCK_BRANCH_CATALOG, ...dynamicBranchCache];
}

const PASTOR_ROLES = new Set(["branch_admin", "pastor", "counsellor"]);

export type BranchEntry = {
  membership: BranchMembership;
  branch: Branch;
};

/** Resolve catalogue metadata for a branch id (fallback for setup-created branches). */
export function resolveBranch(branchId: string): Branch {
  const found = getCatalogBranches().find((item) => item.id === branchId);
  if (found) return found;

  return {
    id: branchId,
    organizationId: "org_unknown",
    name: "Your branch",
    slug: branchId.replace(/^branch_/, ""),
    city: "",
    country: "",
    joinPolicy: "approval_required",
  };
}

export function roleFromMembership(
  membership: BranchMembership | null | undefined,
): UserRole {
  if (!membership || membership.status !== "active") return null;
  return PASTOR_ROLES.has(membership.role) ? "pastor" : "member";
}

export function toBranchEntries(
  memberships: BranchMembership[],
): BranchEntry[] {
  return memberships
    .filter((item) => item.status === "active")
    .map((membership) => ({
      membership,
      branch: resolveBranch(membership.branchId),
    }));
}

/** Active and pending memberships for branch management screens. */
export function toManageableBranchEntries(
  memberships: BranchMembership[],
): BranchEntry[] {
  return memberships
    .filter((item) => item.status === "active" || item.status === "pending")
    .map((membership) => ({
      membership,
      branch: resolveBranch(membership.branchId),
    }));
}

export function resolveOrganizationName(organizationId: string): string {
  if (organizationId === MFM_ORGANIZATION.id) {
    return MFM_ORGANIZATION.name;
  }
  if (organizationId === "org_independent") {
    return "Independent";
  }
  return "Church network";
}

export function membershipStatusLabel(status: MembershipStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "pending":
      return "Pending approval";
    case "left":
      return "Left";
    case "rejected":
      return "Rejected";
  }
}

export function formatJoinedDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function membershipRoleLabel(role: BranchMembership["role"]): string {
  switch (role) {
    case "branch_admin":
      return "Branch admin";
    case "pastor":
      return "Pastor";
    case "counsellor":
      return "Counsellor";
    case "member":
      return "Member";
  }
}

export function joinPolicyLabel(policy: Branch["joinPolicy"]): string {
  switch (policy) {
    case "open":
      return "Open join";
    case "approval_required":
      return "Approval required";
    case "invite_only":
      return "Invite only";
  }
}

export function membershipForBranch(
  memberships: BranchMembership[],
  branchId: string,
): BranchMembership | undefined {
  return memberships.find(
    (item) => item.branchId === branchId && item.status !== "left",
  );
}

export function filterBranchCatalog(
  catalog: Branch[],
  query: string,
  organizationId?: string,
): Branch[] {
  const normalizedQuery = query.trim().toLowerCase();

  return catalog.filter((branch) => {
    if (organizationId && branch.organizationId !== organizationId) {
      return false;
    }

    if (!normalizedQuery) return true;

    const haystack = [
      branch.name,
      branch.city,
      branch.country,
      branch.slug,
      resolveOrganizationName(branch.organizationId),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
