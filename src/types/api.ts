import type {
  LoginPayload,
  ResetPasswordWithOtpPayload,
  SendPasswordOtpPayload,
  Session,
  SignupPayload,
  UserProfile,
} from "@/types/auth";
import type { Branch, BranchMembership, CreateBranchSetupPayload } from "@/types/branch";

/** Service method signatures — UI calls these; mocks today, HTTP later. */

export type AuthService = {
  login(payload: LoginPayload): Promise<Session>;
  signup(payload: SignupPayload): Promise<Session>;
  logout(): Promise<void>;
  getSession(): Promise<Session | null>;
  updateProfile(profile: Partial<UserProfile>): Promise<UserProfile>;
  sendPasswordOtp(payload: SendPasswordOtpPayload): Promise<void>;
  resetPasswordWithOtp(payload: ResetPasswordWithOtpPayload): Promise<void>;
};

export type MembershipService = {
  getMyBranches(): Promise<BranchMembership[]>;
  joinByInviteCode(code: string): Promise<BranchMembership>;
  createPastorBranch(input: {
    churchName: string;
    city?: string;
    country?: string;
  }): Promise<BranchMembership>;
  leaveBranch(branchId: string): Promise<BranchMembership>;
  clearForUser(userId: string): Promise<void>;
};

export type BranchService = {
  getMyBranches(): Promise<BranchMembership[]>;
  getActiveBranchId(): Promise<string | null>;
  setActiveBranch(branchId: string): Promise<void>;
  getBranchBySlug(slug: string): Promise<Branch | null>;
  joinBranch(branchId: string): Promise<BranchMembership>;
  leaveBranch(branchId: string): Promise<void>;
  submitBranchSetup(payload: CreateBranchSetupPayload): Promise<{ requestId: string }>;
};
