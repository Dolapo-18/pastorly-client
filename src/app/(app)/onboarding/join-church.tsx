import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  AuthDivider,
  AuthField,
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth";
import { SecondaryButton } from "@/components/common/secondary-button";
import { borderRadius } from "@/constants/theme";
import {
  completeJoinFlow,
  goToOnboardingAfterPending,
} from "@/features/branch/join-flow";
import { useAppTheme } from "@/hooks/use-app-theme";
import { comingSoon, routes } from "@/lib/routes";
import { membershipService } from "@/services/membership.service";
import { useAuthStore } from "@/store/auth.store";

export default function JoinChurchScreen() {
  const { colors } = useAppTheme();
  const refreshMemberships = useAuthStore((state) => state.refreshMemberships);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setError(null);
    setInfo(null);
    if (!inviteCode.trim()) {
      setError("Enter an invitation code.");
      return;
    }

    setLoading(true);
    try {
      const membership = await membershipService.joinByInviteCode(inviteCode);
      await refreshMemberships();

      const outcome = await completeJoinFlow(membership, refreshMemberships);

      if (outcome === "pending") {
        setInfo(
          "Your join request was sent. A branch admin will review it shortly.",
        );
        setTimeout(() => goToOnboardingAfterPending(), 1200);
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not join this branch.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen showBack backFallbackHref="/(app)/onboarding">
      <View className="gap-7">
        <Text
          className="font-figtree-bold text-[26px] leading-[34px]"
          style={{ color: colors.text }}
        >
          Join your church community
        </Text>

        <Text
          className="font-figtree text-[13px] leading-[19px]"
          style={{ color: colors.textMuted }}
        >
          Try <Text style={{ color: colors.text }}>MFM-ABUJA</Text> for instant
          join, or <Text style={{ color: colors.text }}>MFM-IKEJA</Text> /{" "}
          <Text style={{ color: colors.text }}>GRACE-2024</Text> for pending
          approval.
        </Text>

        <AuthDivider label="invitation code" />

        <AuthField
          label="Enter Invitation Code"
          placeholder="e.g. MFM-ABUJA"
          value={inviteCode}
          onChangeText={setInviteCode}
          autoCapitalize="characters"
          returnKeyType="go"
          onSubmitEditing={() => void handleJoin()}
        />

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

        <AuthPrimaryButton
          label={loading ? "Joining…" : "Join branch"}
          disabled={loading}
          onPress={() => void handleJoin()}
        />

        <SecondaryButton
          label="Browse churches instead"
          onPress={() => router.push(routes.onboardingDiscover)}
        />

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(comingSoon("Scan QR Code"))}
          className="h-[52px] flex-row items-center justify-center gap-2 border active:opacity-80"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
            borderRadius: borderRadius.input,
          }}
        >
          <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
          <Text
            className="font-figtree-semibold text-[16px]"
            style={{ color: colors.primary }}
          >
            Scan QR Code
          </Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}
