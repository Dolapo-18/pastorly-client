import { useState } from "react";
import { Text, View } from "react-native";

import {
  AuthField,
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuthStore } from "@/store/auth.store";

export default function PastorSetupScreen() {
  const { colors } = useAppTheme();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const [churchName, setChurchName] = useState("");
  const [pastorName, setPastorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <AuthScreen
      showBack
      backFallbackHref="/(auth)/role-select"
      contentClassName="justify-between"
    >
      <View className="gap-7">
        <View className="gap-2">
          <Text
            className="font-figtree-bold text-[28px] leading-[36px]"
            style={{ color: colors.text }}
          >
            Let&apos;s set up{"\n"}your church
          </Text>
          <Text
            className="font-figtree-medium text-[14px]"
            style={{ color: colors.textMuted }}
          >
            Step 1 of 4
          </Text>
        </View>

        <View className="gap-4">
          <AuthField
            label="Church Name"
            placeholder="Grace Family Church"
            value={churchName}
            onChangeText={setChurchName}
          />
          <AuthField
            label="Pastor Name"
            placeholder="Pastor John Samuel"
            value={pastorName}
            onChangeText={setPastorName}
          />
          <AuthField
            label="Email"
            placeholder="pastorjohn@gracefamily.org"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AuthField
            label="Phone Number"
            placeholder="+234 801 234 5678"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View className="pt-6">
        <AuthPrimaryButton
          label="Continue"
          onPress={() => setAuthenticated("pastor")}
        />
      </View>
    </AuthScreen>
  );
}
