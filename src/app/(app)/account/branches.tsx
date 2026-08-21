import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth";
import { MembershipStatusBadge } from "@/components/branch";
import { ConfirmSheet } from "@/components/common/confirm-sheet";
import { SecondaryButton } from "@/components/common/secondary-button";
import { switchActiveBranch } from "@/features/branch/switch-branch";
import { useActiveBranch } from "@/hooks/use-active-branch";
import { useAppTheme } from "@/hooks/use-app-theme";
import {
  formatJoinedDate,
  membershipRoleLabel,
  resolveOrganizationName,
  toManageableBranchEntries,
  type BranchEntry,
} from "@/lib/branches";
import { routes } from "@/lib/routes";
import { branchService, membershipService } from "@/services";
import { useAuthStore } from "@/store/auth.store";

export default function MyBranchesScreen() {
  const { colors } = useAppTheme();
  const memberships = useAuthStore((state) => state.memberships);
  const refreshMemberships = useAuthStore((state) => state.refreshMemberships);
  const { activeBranchId } = useActiveBranch();
  const entries = useMemo(
    () => toManageableBranchEntries(memberships),
    [memberships],
  );

  const [leaveTarget, setLeaveTarget] = useState<BranchEntry | null>(null);
  const [cancelTarget, setCancelTarget] = useState<BranchEntry | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<
    "leave" | "switch" | "cancel" | null
  >(null);
  const [switchTargetId, setSwitchTargetId] = useState<string | null>(null);

  const handleOpen = async (branchId: string) => {
    if (branchId === activeBranchId) {
      router.replace(routes.dashboard);
      return;
    }

    setActionError(null);
    setSwitchTargetId(branchId);
    setLoadingAction("switch");
    try {
      await switchActiveBranch(branchId);
    } catch (cause) {
      setActionError(
        cause instanceof Error ? cause.message : "Could not switch branch.",
      );
    } finally {
      setLoadingAction(null);
      setSwitchTargetId(null);
    }
  };

  const handleLeave = async () => {
    if (!leaveTarget) return;

    setActionError(null);
    setLoadingAction("leave");
    try {
      await branchService.leaveBranch(leaveTarget.branch.id);
      await refreshMemberships();
      setLeaveTarget(null);

      if (!useAuthStore.getState().hasActiveBranches) {
        router.replace(routes.onboarding);
        return;
      }

      router.replace(routes.dashboard);
    } catch (cause) {
      setActionError(
        cause instanceof Error ? cause.message : "Could not leave this branch.",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCancelPending = async () => {
    if (!cancelTarget) return;

    setActionError(null);
    setLoadingAction("cancel");
    try {
      await membershipService.cancelPending(cancelTarget.branch.id);
      await refreshMemberships();
      setCancelTarget(null);
    } catch (cause) {
      setActionError(
        cause instanceof Error
          ? cause.message
          : "Could not cancel this request.",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <AuthScreen
        showBack
        backFallbackHref={routes.dashboard}
        contentClassName="justify-between"
      >
        <View className="gap-6">
          <View className="gap-2">
            <Text
              className="font-figtree-bold text-[26px] leading-[34px]"
              style={{ color: colors.text }}
            >
              My branches
            </Text>
            <Text
              className="font-figtree text-[14px] leading-[20px]"
              style={{ color: colors.textMuted }}
            >
              Branches you belong to, including requests awaiting approval.
            </Text>
          </View>

          {entries.length === 0 ? (
            <View
              className="gap-2 rounded-2xl px-4 py-5"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              }}
            >
              <Text
                className="font-figtree-semibold text-[15px]"
                style={{ color: colors.text }}
              >
                No branches yet
              </Text>
              <Text
                className="font-figtree text-[13px] leading-[19px]"
                style={{ color: colors.textMuted }}
              >
                Join a church by browsing the catalogue or using an invite code.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {entries.map(({ branch, membership }) => {
                const isActiveBranch =
                  membership.status === "active" &&
                  branch.id === activeBranchId;
                const isPending = membership.status === "pending";
                const isLoadingSwitch =
                  loadingAction === "switch" && switchTargetId === branch.id;

                return (
                  <View
                    key={membership.id}
                    className="gap-4 rounded-2xl p-4"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: isActiveBranch ? colors.primary : colors.border,
                      borderWidth: isActiveBranch ? 1.5 : 1,
                    }}
                  >
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1 gap-1">
                        <Text
                          className="font-figtree-bold text-[16px]"
                          style={{ color: colors.text }}
                        >
                          {branch.name}
                        </Text>
                        <Text
                          className="font-figtree text-[13px]"
                          style={{ color: colors.textMuted }}
                        >
                          {resolveOrganizationName(branch.organizationId)}
                        </Text>
                        <Text
                          className="font-figtree text-[12px]"
                          style={{ color: colors.textSubtle }}
                        >
                          {[branch.city, branch.country]
                            .filter(Boolean)
                            .join(", ") || "Location pending"}
                        </Text>
                      </View>
                      <MembershipStatusBadge status={membership.status} />
                    </View>

                    <View className="gap-1">
                      <Text
                        className="font-figtree text-[12px]"
                        style={{ color: colors.textMuted }}
                      >
                        {membershipRoleLabel(membership.role)} · Joined{" "}
                        {formatJoinedDate(membership.joinedAt)}
                      </Text>
                      {isActiveBranch ? (
                        <Text
                          className="font-figtree-semibold text-[12px]"
                          style={{ color: colors.primary }}
                        >
                          Current branch
                        </Text>
                      ) : null}
                    </View>

                    <View className="flex-row gap-2">
                      {membership.status === "active" ? (
                        <>
                          <Pressable
                            accessibilityRole="button"
                            onPress={() => void handleOpen(branch.id)}
                            disabled={loadingAction !== null}
                            className="flex-1 items-center rounded-full py-3 active:opacity-80"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <Text
                              className="font-figtree-semibold text-[14px]"
                              style={{ color: colors.onPrimary }}
                            >
                              {isLoadingSwitch
                                ? "Opening…"
                                : isActiveBranch
                                  ? "Open dashboard"
                                  : "Open"}
                            </Text>
                          </Pressable>
                          <Pressable
                            accessibilityRole="button"
                            onPress={() => setLeaveTarget({ branch, membership })}
                            disabled={loadingAction !== null}
                            className="items-center rounded-full px-4 py-3 active:opacity-80"
                            style={{
                              borderColor: colors.border,
                              borderWidth: 1,
                            }}
                          >
                            <Text
                              className="font-figtree-semibold text-[14px]"
                              style={{ color: colors.error }}
                            >
                              Leave
                            </Text>
                          </Pressable>
                        </>
                      ) : isPending ? (
                        <>
                          <Text
                            className="flex-1 font-figtree text-[13px] leading-[19px]"
                            style={{ color: colors.textMuted }}
                          >
                            Waiting for branch approval.
                          </Text>
                          <Pressable
                            accessibilityRole="button"
                            onPress={() => setCancelTarget({ branch, membership })}
                            disabled={loadingAction !== null}
                            className="items-center rounded-full px-4 py-3 active:opacity-80"
                            style={{
                              borderColor: colors.border,
                              borderWidth: 1,
                            }}
                          >
                            <Text
                              className="font-figtree-semibold text-[14px]"
                              style={{ color: colors.error }}
                            >
                              Cancel
                            </Text>
                          </Pressable>
                        </>
                      ) : (
                        <Text
                          className="font-figtree text-[13px] leading-[19px]"
                          style={{ color: colors.textMuted }}
                        >
                          This membership is no longer active.
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {actionError ? (
            <Text
              accessibilityRole="alert"
              className="font-figtree-medium text-[13px]"
              style={{ color: colors.error }}
            >
              {actionError}
            </Text>
          ) : null}
        </View>

        <View className="gap-3 pt-6">
          <AuthPrimaryButton
            label="Discover churches"
            onPress={() => router.push(routes.onboardingDiscover)}
          />
          <SecondaryButton
            label="Join with invite code"
            onPress={() => router.push(routes.onboardingJoin)}
          />
          <SecondaryButton
            label="Back to dashboard"
            onPress={() => router.replace(routes.dashboard)}
          />
        </View>
      </AuthScreen>

      <ConfirmSheet
        visible={cancelTarget !== null}
        title="Cancel join request?"
        message={
          cancelTarget
            ? `Withdraw your pending request for ${cancelTarget.branch.name}.`
            : ""
        }
        confirmLabel="Cancel request"
        destructive
        loading={loadingAction === "cancel"}
        onConfirm={() => void handleCancelPending()}
        onClose={() => setCancelTarget(null)}
      />

      <ConfirmSheet
        visible={leaveTarget !== null}
        title="Leave branch?"
        message={
          leaveTarget
            ? `You will lose access to ${leaveTarget.branch.name}. You can rejoin later if the branch allows it.`
            : ""
        }
        confirmLabel="Leave branch"
        destructive
        loading={loadingAction === "leave"}
        onConfirm={() => void handleLeave()}
        onClose={() => setLeaveTarget(null)}
      />
    </>
  );
}
