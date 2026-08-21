import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  AuthDivider,
  AuthField,
  AuthScreen,
  GoogleIcon,
  SocialAuthButton,
} from "@/components/auth";
import { borderRadius } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuthStore } from "@/store/auth.store";

export default function MemberJoinScreen() {
  const { colors } = useAppTheme();
  const [inviteCode, setInviteCode] = useState("");
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const joinAsMember = () => setAuthenticated("member");

  return (
    <AuthScreen showBack backFallbackHref="/(auth)/role-select">
      <View className="gap-7">
        <Text
          className="font-figtree-bold text-[26px] leading-[34px]"
          style={{ color: colors.text }}
        >
          Join your church community
        </Text>

        <View className="gap-3">
          <SocialAuthButton
            label="Continue with Google"
            icon={<GoogleIcon />}
            onPress={joinAsMember}
          />
          <SocialAuthButton
            label="Continue with Apple"
            icon={
              <Ionicons name="logo-apple" size={20} color={colors.text} />
            }
            onPress={joinAsMember}
          />
          <SocialAuthButton
            label="Continue with Email"
            icon={
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.text}
              />
            }
            onPress={joinAsMember}
          />
        </View>

        <AuthDivider label="or" />

        <AuthField
          label="Enter Invitation Code"
          icon="ticket-outline"
          placeholder="e.g. GRACE-2024"
          value={inviteCode}
          onChangeText={setInviteCode}
          autoCapitalize="characters"
          returnKeyType="go"
          onSubmitEditing={() => {
            if (inviteCode.trim()) joinAsMember();
          }}
        />

        <Pressable
          accessibilityRole="button"
          onPress={joinAsMember}
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
