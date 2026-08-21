import { router } from "expo-router";
import { Text, View } from "react-native";

import { AuthPrimaryButton, AuthScreen } from "@/components/auth";
import { useAppTheme } from "@/hooks/use-app-theme";

/** Legacy route — onboarding now starts after sign-up. */
export default function RoleSelectScreen() {
  const { colors } = useAppTheme();

  return (
    <AuthScreen showBack backFallbackHref="/(auth)/welcome">
      <View className="gap-6">
        <Text
          className="font-figtree-bold text-[26px] leading-[34px]"
          style={{ color: colors.text }}
        >
          Create an account first
        </Text>
        <Text
          className="font-figtree text-[14px] leading-[20px]"
          style={{ color: colors.textMuted }}
        >
          Sign up or sign in, then choose whether to join a church or set up a
          branch.
        </Text>
        <AuthPrimaryButton
          label="Continue to sign up"
          onPress={() => router.replace("/(auth)/signup")}
        />
      </View>
    </AuthScreen>
  );
}
