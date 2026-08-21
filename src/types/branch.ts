/**
 * Multitenancy types — contracts for Sprint 2+.
 * Shapes are locked early so the server can implement the same models later.
 */

export type BranchRole =
  | "branch_admin"
  | "pastor"
  | "counsellor"
  | "member";

export type MembershipStatus = "active" | "pending" | "left" | "rejected";

export type Organization = {
  id: string;
  name: string;
  slug: string;
};

export type Branch = {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  joinPolicy: "open" | "approval_required" | "invite_only";
};

export type BranchMembership = {
  id: string;
  userId: string;
  branchId: string;
  role: BranchRole;
  status: MembershipStatus;
  joinedAt: string;
};

export type SetupRequestStatus = "pending" | "approved" | "rejected";

export type BranchSetupRequest = {
  id: string;
  organizationId: string;
  submitterId: string;
  branchName: string;
  city: string;
  country: string;
  status: SetupRequestStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
};

export type CreateBranchSetupPayload = {
  organizationId: string;
  branchName: string;
  address: string;
  city: string;
  country: string;
  pastorName: string;
  email: string;
  phone: string;
};
