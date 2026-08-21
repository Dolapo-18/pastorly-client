export { authService, authServiceDev } from "@/services/auth.service";
export { branchService } from "@/services/branch.service";

/**
 * Single import surface for UI code.
 *
 * @example
 * import { authService } from "@/services";
 * const session = await authService.login({ email, password });
 */
export type { AuthService, BranchService } from "@/types/api";
