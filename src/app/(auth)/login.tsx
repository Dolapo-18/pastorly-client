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
import { useAuthStore } from "@/store/auth.store";

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await authService.login({ email: email.trim(), password });
      // Sprint 1 will route by session memberships; role picker is temporary.
      setAuthenticated("pastor");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      showBack
      backFallbackHref="/(auth)/welcome"
      contentClassName="justify-between"
    >
      <View className="gap-7">
        <View className="gap-2">
          <Text
            className="font-figtree-bold text-[26px] leading-[34px]"
            style={{ color: colors.text }}
          >
            Sign in
          </Text>
          <Text
            className="font-figtree text-[14px] leading-[20px]"
            style={{ color: colors.textMuted }}
          >
            Use your Pastorly account. Your role and church are resolved after
            sign-in.
          </Text>
        </View>

        <View className="gap-4">
          <AuthField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <AuthField
            label="Password"
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            isPassword
            autoComplete="password"
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
        </View>
      </View>

      <View className="gap-4 pt-6">
        <AuthPrimaryButton
          label={loading ? "Signing in…" : "Sign in"}
          disabled={loading}
          onPress={handleLogin}
        />
        <Text
          className="text-center font-figtree text-[14px]"
          style={{ color: colors.textMuted }}
        >
          Don&apos;t have an account?{" "}
          <Text
            accessibilityRole="link"
            onPress={() => router.push("/(auth)/signup")}
            className="font-figtree-semibold"
            style={{ color: colors.primary }}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </AuthScreen>
  );
}
