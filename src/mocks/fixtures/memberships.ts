import type { BranchMembership } from "@/types/branch";
import { DEMO_USER_EMAIL } from "@/mocks/fixtures/branches";

/** Active memberships seeded for the demo pastor account. */
export function demoMembershipsForUser(userId: string): BranchMembership[] {
  return [
    {
      id: "mem_demo_ikeja",
      userId,
      branchId: "branch_mfm_ikeja",
      role: "branch_admin",
      status: "active",
      joinedAt: "2025-01-15T09:00:00.000Z",
    },
    {
      id: "mem_demo_abuja",
      userId,
      branchId: "branch_mfm_abuja",
      role: "pastor",
      status: "active",
      joinedAt: "2025-03-02T11:30:00.000Z",
    },
  ];
}

export function isDemoAccountEmail(email: string) {
  return email.trim().toLowerCase() === DEMO_USER_EMAIL;
}
