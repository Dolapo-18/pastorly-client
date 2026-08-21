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

export default function SignupScreen() {
  const { colors } = useAppTheme();
  const signIn = useAuthStore((state) => state.signIn);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(null);
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Fill in all fields to continue.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const name = [firstName, lastName]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(" ");

      const session = await authService.signup({
        name,
        email: email.trim(),
        password,
      });
      await signIn(session);
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
            Create account
          </Text>
          <Text
            className="font-figtree text-[14px] leading-[20px]"
            style={{ color: colors.textMuted }}
          >
            One global identity for Pastorly. Next you&apos;ll connect to a
            church or set up a branch.
          </Text>
        </View>

        <View className="gap-4">
          <AuthField
            label="First name"
            placeholder="John"
            value={firstName}
            onChangeText={setFirstName}
            autoComplete="given-name"
          />
          <AuthField
            label="Last name"
            placeholder="Samuel"
            value={lastName}
            onChangeText={setLastName}
            autoComplete="family-name"
          />
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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            isPassword
            autoComplete="new-password"
          />
          <AuthField
            label="Confirm password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            autoComplete="new-password"
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
          label={loading ? "Creating account…" : "Continue"}
          disabled={loading}
          onPress={() => void handleSignup()}
        />
        <Text
          className="text-center font-figtree text-[14px]"
          style={{ color: colors.textMuted }}
        >
          Already have an account?{" "}
          <Text
            accessibilityRole="link"
            onPress={() => router.push("/(auth)/login")}
            className="font-figtree-semibold"
            style={{ color: colors.primary }}
          >
            Sign in
          </Text>
        </Text>
      </View>
    </AuthScreen>
  );
}
