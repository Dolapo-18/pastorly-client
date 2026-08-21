import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import {
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth";
import { MembershipStatusBadge } from "@/components/branch";
import { ConfirmSheet } from "@/components/common/confirm-sheet";
import { DetailRow } from "@/components/common/detail-row";
import { SecondaryButton } from "@/components/common/secondary-button";
import { accents } from "@/constants/theme";
import {
  completeJoinFlow,
  goToOnboardingAfterPending,
} from "@/features/branch/join-flow";
import { switchActiveBranch } from "@/features/branch/switch-branch";
import { useAppTheme } from "@/hooks/use-app-theme";
import {
  joinPolicyLabel,
  membershipForBranch,
  resolveOrganizationName,
} from "@/lib/branches";
import { routes } from "@/lib/routes";
import { branchService, membershipService } from "@/services";
import { useAuthStore } from "@/store/auth.store";
import type { Branch } from "@/types/branch";

export default function BranchDetailScreen() {
  const { colors } = useAppTheme();
  const { slug: slugParam } = useLocalSearchParams<{ slug?: string }>();
  const slug = typeof slugParam === "string" ? slugParam : "";

  const memberships = useAuthStore((state) => state.memberships);
  const refreshMemberships = useAuthStore((state) => state.refreshMemberships);

  const [branch, setBranch] = useState<Branch | null>(null);
  const [loadingBranch, setLoadingBranch] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!slug) {
      setBranch(null);
      setLoadingBranch(false);
      return;
    }

    setLoadingBranch(true);
    void branchService.getBranchBySlug(slug).then((result) => {
      if (!cancelled) {
        setBranch(result);
        setLoadingBranch(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const membership = branch ? membershipForBranch(memberships, branch.id) : null;

  const handleJoin = async () => {
    if (!branch) return;

    setError(null);
    setInfo(null);
    setActionLoading(true);
    try {
      const result = await branchService.joinBranch(branch.id);
      const outcome = await completeJoinFlow(result, refreshMemberships);

      if (outcome === "pending") {
        setInfo("Your join request was sent. Waiting for branch approval.");
        setTimeout(() => goToOnboardingAfterPending(), 1200);
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not join this branch.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDashboard = async () => {
    if (!branch || membership?.status !== "active") return;

    setActionLoading(true);
    try {
      await switchActiveBranch(branch.id);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelPending = async () => {
    if (!branch) return;

    setError(null);
    setActionLoading(true);
    try {
      await membershipService.cancelPending(branch.id);
      await refreshMemberships();
      setShowCancel(false);
      setInfo("Join request cancelled.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not cancel this request.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loadingBranch) {
    return (
      <AuthScreen showBack backFallbackHref={routes.onboardingDiscover}>
        <Text className="font-figtree text-[14px]" style={{ color: colors.textMuted }}>
          Loading branch…
        </Text>
      </AuthScreen>
    );
  }

  if (!branch) {
    return (
      <AuthScreen
        showBack
        backFallbackHref={routes.onboardingDiscover}
        contentClassName="justify-between"
      >
        <Text
          className="font-figtree-bold text-[22px]"
          style={{ color: colors.text }}
        >
          Branch not found
        </Text>
        <SecondaryButton
          label="Back to search"
          onPress={() => router.replace(routes.onboardingDiscover)}
        />
      </AuthScreen>
    );
  }

  const isInviteOnly = branch.joinPolicy === "invite_only";
  const isPending = membership?.status === "pending";
  const isActive = membership?.status === "active";

  return (
    <>
      <AuthScreen
        showBack
        backFallbackHref={routes.onboardingDiscover}
        contentClassName="justify-between"
      >
        <View className="gap-6">
          <View className="gap-2">
            <Text
              className="font-figtree-bold text-[26px] leading-[34px]"
              style={{ color: colors.text }}
            >
              {branch.name}
            </Text>
            <Text
              className="font-figtree text-[14px] leading-[20px]"
              style={{ color: colors.textMuted }}
            >
              {resolveOrganizationName(branch.organizationId)}
            </Text>
            {membership ? (
              <MembershipStatusBadge status={membership.status} />
            ) : null}
          </View>

          <View
            className="overflow-hidden rounded-2xl"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            <DetailRow
              icon="map-marker-outline"
              tint={accents.teal}
              label="Location"
              value={
                [branch.city, branch.country].filter(Boolean).join(", ") ||
                "Not listed"
              }
            />
            <DetailRow
              icon="account-group-outline"
              tint={accents.purple}
              label="Join policy"
              value={joinPolicyLabel(branch.joinPolicy)}
              showDivider={false}
            />
          </View>

          {isInviteOnly && !membership ? (
            <Text
              className="font-figtree text-[13px] leading-[19px]"
              style={{ color: colors.textMuted }}
            >
              This branch is invite-only. Browse won&apos;t join directly — use an
              invitation code from your church.
            </Text>
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
          {info ? (
            <Text
              className="font-figtree-medium text-[13px]"
              style={{ color: colors.success }}
            >
              {info}
            </Text>
          ) : null}
        </View>

        <View className="gap-3 pt-6">
          {isActive ? (
            <AuthPrimaryButton
              label={actionLoading ? "Opening…" : "Open dashboard"}
              disabled={actionLoading}
              onPress={() => void handleOpenDashboard()}
            />
          ) : isPending ? (
            <>
              <AuthPrimaryButton
                label="Pending approval"
                disabled
                onPress={undefined}
              />
              <SecondaryButton
                label="Cancel request"
                onPress={() => setShowCancel(true)}
              />
            </>
          ) : isInviteOnly ? (
            <AuthPrimaryButton
              label="Enter invite code"
              onPress={() => router.push(routes.onboardingJoin)}
            />
          ) : (
            <AuthPrimaryButton
              label={
                actionLoading
                  ? "Joining…"
                  : branch.joinPolicy === "open"
                    ? "Join branch"
                    : "Request to join"
              }
              disabled={actionLoading}
              onPress={() => void handleJoin()}
            />
          )}

          <SecondaryButton
            label="Back to search"
            onPress={() => router.back()}
          />
        </View>
      </AuthScreen>

      <ConfirmSheet
        visible={showCancel}
        title="Cancel join request?"
        message={`Your pending request for ${branch.name} will be withdrawn.`}
        confirmLabel="Cancel request"
        destructive
        loading={actionLoading}
        onConfirm={() => void handleCancelPending()}
        onClose={() => setShowCancel(false)}
      />
    </>
  );
}
