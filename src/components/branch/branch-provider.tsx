import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "@/store/auth.store";
import { useBranchStore } from "@/store/branch.store";

type BranchProviderProps = {
  children: ReactNode;
};

/** Keeps branch context in sync with auth session and memberships. */
export function BranchProvider({ children }: BranchProviderProps) {
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);
  const memberships = useAuthStore((state) => state.memberships);
  const sync = useBranchStore((state) => state.sync);
  const clear = useBranchStore((state) => state.clear);

  useEffect(() => {
    if (status !== "authenticated" || !session) {
      clear();
      return;
    }

    void sync(memberships, session.user.id);
  }, [status, session, memberships, sync, clear]);

  return children;
}
