import { create } from "zustand";

export type UserRole = "pastor" | "member" | null;
type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type AuthState = {
  status: AuthStatus;
  role: UserRole;
  setAuthenticated: (role: NonNullable<UserRole>) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: "unauthenticated",
  role: null,
  setAuthenticated: (role) => set({ status: "authenticated", role }),
  signOut: () => set({ status: "unauthenticated", role: null }),
}));
