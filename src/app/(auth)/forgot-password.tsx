import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import {
  AuthField,
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth";
import { useAppTheme } from "@/hooks/use-app-theme";
import { authService } from "@/services";

export default function ForgotPasswordScreen() {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim()) {
      setError("Enter the email for your account.");
      return;
    }

    setLoading(true);
    try {
      await authService.requestPasswordReset({ email: email.trim() });
      setSent(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      showBack
      backFallbackHref="/(auth)/login"
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
            {sent
              ? "If an account exists for that email, we sent reset instructions."
              : "Enter your email and we'll send a reset link."}
          </Text>
        </View>

        {!sent ? (
          <AuthField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
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

      <View className="gap-4 pt-6">
        {!sent ? (
          <AuthPrimaryButton
            label={loading ? "Sending…" : "Send reset link"}
            disabled={loading}
            onPress={() => void handleSubmit()}
          />
        ) : (
          <AuthPrimaryButton
            label="Back to sign in"
            onPress={() => router.replace("/(auth)/login")}
          />
        )}
      </View>
    </AuthScreen>
  );
}
