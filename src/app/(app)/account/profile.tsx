import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import {
  AuthField,
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth";
import { routes } from "@/lib/routes";
import { useAppTheme } from "@/hooks/use-app-theme";
import { authService } from "@/services";
import { useAuthStore } from "@/store/auth.store";

export default function GlobalProfileScreen() {
  const { colors } = useAppTheme();
  const session = useAuthStore((state) => state.session);
  const setSessionUser = useAuthStore((state) => state.setSessionUser);
  const [name, setName] = useState(session?.user.name ?? "");
  const [email, setEmail] = useState(session?.user.email ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError(null);
    setSaved(false);
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setLoading(true);
    try {
      const profile = await authService.updateProfile({
        name: name.trim(),
        email: email.trim(),
      });
      if (session) {
        setSessionUser({ ...session.user, ...profile });
      }
      setSaved(true);
    } catch {
      setError("Could not save your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      showBack
      backFallbackHref={routes.pastorHome}
      contentClassName="justify-between"
    >
      <View className="gap-7">
        <View className="gap-2">
          <Text
            className="font-figtree-bold text-[26px] leading-[34px]"
            style={{ color: colors.text }}
          >
            Your profile
          </Text>
          <Text
            className="font-figtree text-[14px] leading-[20px]"
            style={{ color: colors.textMuted }}
          >
            Global account details shared across every branch you join.
          </Text>
        </View>

        <View className="gap-4">
          <AuthField
            label="Full name"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoComplete="name"
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
          {error ? (
            <Text
              accessibilityRole="alert"
              className="font-figtree-medium text-[13px]"
              style={{ color: colors.error }}
            >
              {error}
            </Text>
          ) : null}
          {saved ? (
            <Text
              className="font-figtree-medium text-[13px]"
              style={{ color: colors.success }}
            >
              Profile saved.
            </Text>
          ) : null}
        </View>
      </View>

      <View className="gap-3 pt-6">
        <AuthPrimaryButton
          label={loading ? "Saving…" : "Save changes"}
          disabled={loading}
          onPress={() => void handleSave()}
        />
        <Text
          accessibilityRole="link"
          onPress={() => router.back()}
          className="text-center font-figtree-medium text-[14px]"
          style={{ color: colors.textMuted }}
        >
          Cancel
        </Text>
      </View>
    </AuthScreen>
  );
}
