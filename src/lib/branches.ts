import { MOCK_BRANCH_CATALOG } from "@/mocks/fixtures/branches";
import type { UserRole } from "@/store/auth.store";
import type { Branch, BranchMembership } from "@/types/branch";

const PASTOR_ROLES = new Set(["branch_admin", "pastor", "counsellor"]);

export type BranchEntry = {
  membership: BranchMembership;
  branch: Branch;
};

/** Resolve catalogue metadata for a branch id (fallback for setup-created branches). */
export function resolveBranch(branchId: string): Branch {
  const found = MOCK_BRANCH_CATALOG.find((item) => item.id === branchId);
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
