import type { Session, User } from "@/types/auth";
import type { BranchMembership } from "@/types/branch";
import { authService } from "@/services/auth.service";
import { membershipService } from "@/services/membership.service";
import { useBranchStore } from "@/store/branch.store";
import { create } from "zustand";

export type UserRole = "pastor" | "member" | null;
type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type AuthState = {
  status: AuthStatus;
  session: Session | null;
  role: UserRole;
  hasActiveBranches: boolean;
  memberships: BranchMembership[];
  hydrate: () => Promise<void>;
  signIn: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
  refreshMemberships: () => Promise<void>;
  setSessionUser: (user: User) => void;
};

const PASTOR_ROLES = new Set(["branch_admin", "pastor", "counsellor"]);

export function roleFromMemberships(memberships: BranchMembership[]): UserRole {
  const active = memberships.filter((item) => item.status === "active");
  if (!active.length) return null;
  return active.some((item) => PASTOR_ROLES.has(item.role))
    ? "pastor"
    : "member";
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "checking",
  session: null,
  role: null,
  hasActiveBranches: false,
  memberships: [],

  hydrate: async () => {
    set({ status: "checking" });
    const session = await authService.getSession();
    if (!session) {
      useBranchStore.getState().clear();
      set({
        status: "unauthenticated",
        session: null,
        role: null,
        hasActiveBranches: false,
        memberships: [],
      });
      return;
    }
    set({ session, status: "authenticated" });
    await get().refreshMemberships();
  },

  signIn: async (session) => {
    set({ session, status: "authenticated" });
    await get().refreshMemberships();
  },

  signOut: async () => {
    await authService.logout();
    useBranchStore.getState().clear();
    set({
      status: "unauthenticated",
      session: null,
      role: null,
      hasActiveBranches: false,
      memberships: [],
    });
  },

  refreshMemberships: async () => {
    const session = get().session;
    const memberships = await membershipService.getMyBranches();
    const active = memberships.filter((item) => item.status === "active");

    if (session) {
      await useBranchStore.getState().sync(memberships, session.user.id);
    }

    const branchRole = useBranchStore.getState().roleAtActiveBranch;
    set({
      memberships,
      hasActiveBranches: active.length > 0,
      role: branchRole ?? roleFromMemberships(memberships),
    });
  },

  setSessionUser: (user) => {
    const session = get().session;
    if (!session) return;
    set({ session: { ...session, user } });
  },
}));

/** @deprecated Use signIn + refreshMemberships. Kept for gradual migration. */
export function useLegacySetAuthenticated() {
  return useAuthStore.getState().signIn;
}
