import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import {
  AuthPrimaryButton,
  AuthScreen,
  RoleCard,
} from "@/components/auth";
import { useAppTheme } from "@/hooks/use-app-theme";

type Role = "pastor" | "member" | null;

export default function RoleSelectScreen() {
  const { colors } = useAppTheme();
  const [selected, setSelected] = useState<Role>(null);

  return (
    <AuthScreen
      showBack
      backFallbackHref="/(auth)/welcome"
      contentClassName="justify-between"
    >
      <View className="gap-8">
        <Text
          className="font-figtree-bold text-[26px] leading-[34px]"
          style={{ color: colors.text }}
        >
          How would you like to use Pastorly?
        </Text>

        <View className="gap-4">
          <RoleCard
            title="Pastor / Ministry Leader"
            description="Lead your congregation, organize prayer, and provide pastoral care."
            icon="person-outline"
            selected={selected === "pastor"}
            onPress={() => setSelected("pastor")}
          />
          <RoleCard
            title="Church Member"
            description="Connect with your church, join prayer communities, and receive pastoral support."
            icon="people-outline"
            selected={selected === "member"}
            onPress={() => setSelected("member")}
          />
        </View>
      </View>

      <View className="pt-6">
        <AuthPrimaryButton
          label="Continue"
          disabled={!selected}
          onPress={() => {
            if (selected === "pastor") {
              router.push("/(auth)/pastor/setup");
            } else if (selected === "member") {
              router.push("/(auth)/member/join");
            }
          }}
        />
      </View>
    </AuthScreen>
  );
}
