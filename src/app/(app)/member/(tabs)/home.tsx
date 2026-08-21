import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SecondaryButton } from "@/components/common/secondary-button";
import { ScriptureCard } from "@/components/dashboard/scripture-card";
import {
  dailyScripture,
  greetingForHour,
} from "@/features/dashboard/pastor-dashboard.data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { routes } from "@/lib/routes";
import { useAuthStore } from "@/store/auth.store";

export default function MemberHomeScreen() {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const session = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);
  const name = session?.user.name?.split(" ")[0] ?? "Friend";

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-6 px-6"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 32,
        }}
      >
        <View className="gap-1">
          <Text
            className="font-figtree text-[13px]"
            style={{ color: colors.textMuted }}
          >
            {greetingForHour(new Date().getHours())}
          </Text>
          <Text
            className="font-figtree-bold text-[24px] leading-[30px]"
            style={{ color: colors.text }}
          >
            Welcome, {name}
          </Text>
        </View>

        <ScriptureCard
          verse={dailyScripture.verse}
          reference={dailyScripture.reference}
        />

        <Text
          className="font-figtree text-[14px] leading-[20px]"
          style={{ color: colors.textMuted }}
        >
          The member experience is next up in the mockup — prayer requests,
          groups and testimonies land here.
        </Text>

        <SecondaryButton
          label="Edit profile"
          onPress={() => router.push(routes.accountProfile)}
        />
        <SecondaryButton label="Sign Out" onPress={() => void signOut()} />
      </ScrollView>
    </View>
  );
}
