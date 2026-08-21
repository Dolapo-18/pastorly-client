import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RoleCard } from "@/components/auth";
import { MembershipStatusBadge } from "@/components/branch";
import { ConfirmSheet } from "@/components/common/confirm-sheet";
import { SecondaryButton } from "@/components/common/secondary-button";
import { Screen } from "@/components/common/screen";
import { useAppTheme } from "@/hooks/use-app-theme";
import { resolveBranch, resolveOrganizationName } from "@/lib/branches";
import { routes } from "@/lib/routes";
import { branchService, membershipService } from "@/services";
import { useAuthStore } from "@/store/auth.store";
import type { BranchMembership, BranchSetupRequest } from "@/types/branch";

export default function OnboardingScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const session = useAuthStore((state) => state.session);
  const memberships = useAuthStore((state) => state.memberships);
  const refreshMemberships = useAuthStore((state) => state.refreshMemberships);
  const signOut = useAuthStore((state) => state.signOut);

  const pending = memberships.filter((item) => item.status === "pending");
  const [setupRequest, setSetupRequest] = useState<BranchSetupRequest | null>(
    null,
  );
  const [cancelTarget, setCancelTarget] = useState<BranchMembership | null>(
    null,
  );
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const loadSetupRequest = useCallback(async () => {
    const request = await branchService.getPendingSetupRequest();
    setSetupRequest(request);
  }, []);

  useEffect(() => {
    void loadSetupRequest();
  }, [loadSetupRequest]);

  const handleCancelPending = async () => {
    if (!cancelTarget) return;

    setCancelError(null);
    setCancelLoading(true);
    try {
      await membershipService.cancelPending(cancelTarget.branchId);
      await refreshMemberships();
      setCancelTarget(null);
    } catch (cause) {
      setCancelError(
        cause instanceof Error
          ? cause.message
          : "Could not cancel this request.",
      );
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <>
      <Screen className="px-7" edges={false} style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-1 justify-between pb-8">
          <View className="gap-8">
            <View className="gap-2">
              <Text
                className="font-figtree-bold text-[26px] leading-[34px]"
                style={{ color: colors.text }}
              >
                Connect to a church
              </Text>
              <Text
                className="font-figtree text-[14px] leading-[20px]"
                style={{ color: colors.textMuted }}
              >
                {session?.user.name
                  ? `Welcome, ${session.user.name}. Join a branch or set one up to continue.`
                  : "Join a branch or set one up to continue."}
              </Text>
            </View>

            {setupRequest ? (
              <View
                className="gap-3 rounded-2xl px-4 py-4"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1 gap-1">
                    <Text
                      className="font-figtree-semibold text-[14px]"
                      style={{ color: colors.text }}
                    >
                      Branch setup in review
                    </Text>
                    <Text
                      className="font-figtree-bold text-[16px]"
                      style={{ color: colors.text }}
                    >
                      {setupRequest.branchName}
                    </Text>
                    <Text
                      className="font-figtree text-[12px]"
                      style={{ color: colors.textMuted }}
                    >
                      {resolveOrganizationName(setupRequest.organizationId)}
                    </Text>
                  </View>
                  <MembershipStatusBadge status="pending" />
                </View>
                <SecondaryButton
                  label="View setup status"
                  onPress={() => router.push(routes.setupBranchPending)}
                />
              </View>
            ) : null}

            {pending.length > 0 ? (
              <View
                className="gap-3 rounded-2xl px-4 py-4"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <View className="gap-1">
                  <Text
                    className="font-figtree-semibold text-[14px]"
                    style={{ color: colors.text }}
                  >
                    Pending approval
                  </Text>
                  <Text
                    className="font-figtree text-[13px] leading-[19px]"
                    style={{ color: colors.textMuted }}
                  >
                    These branch requests are waiting for a pastor or admin to
                    approve you.
                  </Text>
                </View>

                <View className="gap-2">
                  {pending.map((membership) => {
                    const branch = resolveBranch(membership.branchId);
                    return (
                      <View
                        key={membership.id}
                        className="gap-3 rounded-xl px-3 py-3"
                        style={{ backgroundColor: colors.background }}
                      >
                        <View className="flex-row items-start justify-between gap-3">
                          <View className="flex-1 gap-0.5">
                            <Text
                              className="font-figtree-semibold text-[14px]"
                              style={{ color: colors.text }}
                            >
                              {branch.name}
                            </Text>
                            <Text
                              className="font-figtree text-[12px]"
                              style={{ color: colors.textMuted }}
                            >
                              {[branch.city, branch.country]
                                .filter(Boolean)
                                .join(", ") || "Branch request"}
                            </Text>
                          </View>
                          <MembershipStatusBadge status="pending" />
                        </View>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => setCancelTarget(membership)}
                          className="self-start active:opacity-70"
                        >
                          <Text
                            className="font-figtree-semibold text-[13px]"
                            style={{ color: colors.error }}
                          >
                            Cancel request
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}

            {cancelError ? (
              <Text
                accessibilityRole="alert"
                className="font-figtree-medium text-[13px]"
                style={{ color: colors.error }}
              >
                {cancelError}
              </Text>
            ) : null}

            <View className="gap-4">
              <RoleCard
                title="Find your church"
                description="Browse MFM and independent branches, or join with an invite code."
                icon="people-outline"
                selected={false}
                onPress={() => router.push(routes.onboardingDiscover)}
              />
              <RoleCard
                title="Set up a church / branch"
                description="Register a new branch and become its admin after approval."
                icon="person-outline"
                selected={false}
                onPress={() => router.push(routes.onboardingSetup)}
              />
            </View>
          </View>

          <View className="gap-3">
            {memberships.length > 0 ? (
              <SecondaryButton
                label="View my branches"
                onPress={() => router.push(routes.myBranches)}
              />
            ) : null}
            <SecondaryButton
              label="Edit global profile"
              onPress={() => router.push(routes.accountProfile)}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => void signOut()}
              className="items-center py-2 active:opacity-70"
            >
              <Text
                className="font-figtree-medium text-[14px]"
                style={{ color: colors.textMuted }}
              >
                Sign out
              </Text>
            </Pressable>
          </View>
        </View>
      </Screen>

      <ConfirmSheet
        visible={cancelTarget !== null}
        title="Cancel join request?"
        message={
          cancelTarget
            ? `Withdraw your pending request for ${resolveBranch(cancelTarget.branchId).name}.`
            : ""
        }
        confirmLabel="Cancel request"
        destructive
        loading={cancelLoading}
        onConfirm={() => void handleCancelPending()}
        onClose={() => setCancelTarget(null)}
      />
    </>
  );
}
