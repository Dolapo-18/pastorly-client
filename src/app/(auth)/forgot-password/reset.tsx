import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import {
  AuthField,
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth";
import { useAppTheme } from "@/hooks/use-app-theme";
import { authService } from "@/services";

export default function ResetPasswordScreen() {
  const { colors } = useAppTheme();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const email = typeof emailParam === "string" ? emailParam : "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setError(null);

    if (!email) {
      setError("Missing email. Go back and request a new code.");
      return;
    }
    if (!otp.trim()) {
      setError("Enter the one-time code from your email.");
      return;
    }
    if (!password.trim()) {
      setError("Enter a new password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPasswordWithOtp({
        email,
        otp: otp.trim(),
        password,
      });
      router.replace("/(auth)/login");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      showBack
      backFallbackHref="/(auth)/forgot-password"
      contentClassName="justify-between"
    >
      <View className="gap-7">
        <View className="gap-2">
          <Text
            className="font-figtree-bold text-[26px] leading-[34px]"
            style={{ color: colors.text }}
          >
            Reset password
          </Text>
          <Text
            className="font-figtree text-[14px] leading-[20px]"
            style={{ color: colors.textMuted }}
          >
            Enter the code we sent and choose a new password.
          </Text>
        </View>

        <View className="gap-4">
          <AuthField
            label="Email"
            value={email}
            editable={false}
            selectTextOnFocus={false}
          />

          <AuthField
            label="OTP"
            placeholder="123456"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            maxLength={6}
          />

          <AuthField
            label="New password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            isPassword
            autoComplete="new-password"
          />

          <AuthField
            label="Confirm password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            autoComplete="new-password"
          />
        </View>

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

      <View className="gap-4 pt-6">
        <AuthPrimaryButton
          label={loading ? "Resetting…" : "Reset password"}
          disabled={loading}
          onPress={() => void handleReset()}
        />
      </View>
    </AuthScreen>
  );
}
