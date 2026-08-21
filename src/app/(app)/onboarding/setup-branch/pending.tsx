import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";

import {
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth";
import { MembershipStatusBadge } from "@/components/branch";
import { SecondaryButton } from "@/components/common/secondary-button";
import { useAppTheme } from "@/hooks/use-app-theme";
import { resolveOrganizationName } from "@/lib/branches";
import { routes } from "@/lib/routes";
import { branchService, branchServiceDev } from "@/services";
import { useAuthStore } from "@/store/auth.store";
import type { BranchSetupRequest } from "@/types/branch";

export default function SetupBranchPendingScreen() {
  const { colors } = useAppTheme();
  const refreshMemberships = useAuthStore((state) => state.refreshMemberships);
  const hasActiveBranches = useAuthStore((state) => state.hasActiveBranches);

  const [request, setRequest] = useState<BranchSetupRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRequest = useCallback(async () => {
    setLoading(true);
    try {
      const requests = await branchService.getMySetupRequests();
      const latest = requests.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      )[0];
      setRequest(latest ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequest();
  }, [loadRequest]);

  useEffect(() => {
    if (hasActiveBranches) {
      router.replace(routes.dashboard);
    }
  }, [hasActiveBranches]);

  const handleDevApprove = async () => {
    if (!request) return;

    setError(null);
    setApproving(true);
    try {
      await branchServiceDev.approveSetupRequest(request.id);
      await refreshMemberships();
      router.replace(routes.dashboard);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not approve request.",
      );
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <AuthScreen showBack backFallbackHref={routes.onboarding}>
        <Text className="font-figtree text-[14px]" style={{ color: colors.textMuted }}>
          Loading request…
        </Text>
      </AuthScreen>
    );
  }

  if (!request) {
    return (
      <AuthScreen
        showBack
        backFallbackHref={routes.onboarding}
        contentClassName="justify-between"
      >
        <Text
          className="font-figtree-bold text-[22px]"
          style={{ color: colors.text }}
        >
          No setup request found
        </Text>
        <SecondaryButton
          label="Start setup wizard"
          onPress={() => router.replace(routes.onboardingSetup)}
        />
      </AuthScreen>
    );
  }

  const isPending = request.status === "pending";
  const isRejected = request.status === "rejected";

  return (
    <AuthScreen
      showBack
      backFallbackHref={routes.onboarding}
      contentClassName="justify-between"
    >
      <View className="gap-6">
        <View className="gap-2">
          <MembershipStatusBadge
            status={isPending ? "pending" : isRejected ? "rejected" : "active"}
          />
          <Text
            className="font-figtree-bold text-[26px] leading-[34px]"
            style={{ color: colors.text }}
          >
            {isPending
              ? "Setup pending approval"
              : isRejected
                ? "Setup request declined"
                : "Setup approved"}
          </Text>
          <Text
            className="font-figtree text-[14px] leading-[20px]"
            style={{ color: colors.textMuted }}
          >
            {isPending
              ? "We received your branch registration and sent a confirmation to your email. A platform admin will review it shortly."
              : isRejected
                ? request.rejectionReason ??
                  "Your branch setup request was not approved."
                : "Your branch setup has been approved."}
          </Text>
        </View>

        <View
          className="gap-2 rounded-2xl px-4 py-4"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
          }}
        >
          <Text
            className="font-figtree-bold text-[16px]"
            style={{ color: colors.text }}
          >
            {request.branchName}
          </Text>
          <Text
            className="font-figtree text-[13px]"
            style={{ color: colors.textMuted }}
          >
            {resolveOrganizationName(request.organizationId)}
          </Text>
          <Text
            className="font-figtree text-[13px]"
            style={{ color: colors.textSubtle }}
          >
            {[request.city, request.country].filter(Boolean).join(", ")}
          </Text>
        </View>

        {isPending ? (
          <View
            className="gap-2 rounded-2xl px-4 py-4"
            style={{ backgroundColor: colors.surfaceMuted }}
          >
            <Text
              className="font-figtree-semibold text-[14px]"
              style={{ color: colors.text }}
            >
              What happens next
            </Text>
            <Text
              className="font-figtree text-[13px] leading-[19px]"
              style={{ color: colors.textMuted }}
            >
              While you wait, you can join an existing branch as a member. Branch
              admin tools unlock only after approval.
            </Text>
          </View>
        ) : null}

        {error ? (
          <Text
            accessibilityRole="alert"
            className="font-figtree-medium text-[13px]"
            style={{ color: colors.error }}
          >
            {error}
          </Text>
        ) : null}
      </View>

      <View className="gap-3 pt-6">
        {isPending ? (
          <>
            <AuthPrimaryButton
              label={approving ? "Approving…" : "Simulate approval (dev)"}
              disabled={approving}
              onPress={() => void handleDevApprove()}
            />
            <SecondaryButton
              label="Find a church to join"
              onPress={() => router.push(routes.onboardingDiscover)}
            />
          </>
        ) : isRejected ? (
          <AuthPrimaryButton
            label="Submit a new request"
            onPress={() => router.replace(routes.onboardingSetup)}
          />
        ) : (
          <AuthPrimaryButton
            label="Go to dashboard"
            onPress={() => router.replace(routes.dashboard)}
          />
        )}
        <SecondaryButton
          label="Back to onboarding"
          onPress={() => router.replace(routes.onboarding)}
        />
      </View>
    </AuthScreen>
  );
}
