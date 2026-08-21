import { useEffect, type ReactNode } from "react";

import { SplashPlaceholder } from "@/components/common/splash-placeholder";
import { useAuthStore } from "@/store/auth.store";

type AuthBootstrapProps = {
  children: ReactNode;
};

/** Restores the persisted session before rendering routed screens. */
export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const status = useAuthStore((state) => state.status);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (status === "checking") {
    return <SplashPlaceholder />;
  }

  return children;
}
