import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DetailRow } from "@/components/common/detail-row";
import { SecondaryButton } from "@/components/common/secondary-button";
import { accents, borderRadius } from "@/constants/theme";
import { pastorProfile } from "@/features/dashboard/pastor-dashboard.data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { withAlpha } from "@/lib/color";
import { comingSoon } from "@/lib/routes";
import { useAuthStore } from "@/store/auth.store";

const SETTINGS = [
  {
    id: "church",
    icon: "church" as const,
    tint: accents.purple,
    label: "Church Profile",
    screen: 33,
  },
  {
    id: "notifications",
    icon: "bell-outline" as const,
    tint: accents.coral,
    label: "Notifications",
    screen: 28,
  },
  {
    id: "members",
    icon: "account-group-outline" as const,
    tint: accents.teal,
    label: "Members",
    screen: 19,
  },
  {
    id: "help",
    icon: "help-circle-outline" as const,
    tint: accents.amber,
    label: "Help & Support",
    screen: 40,
  },
];

export default function PastorProfileScreen() {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-6 px-6"
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 32 }}
      >
        <View className="items-center gap-3">
          <View
            className="h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: withAlpha(colors.primary, 0.16) }}
          >
            <Text
              className="font-figtree-bold text-[24px]"
              style={{ color: colors.primary }}
            >
              PJ
            </Text>
          </View>
          <View className="items-center gap-1">
            <Text
              className="font-figtree-bold text-[20px]"
              style={{ color: colors.text }}
            >
              {pastorProfile.name}
            </Text>
            <Text
              className="font-figtree text-[13px]"
              style={{ color: colors.textMuted }}
            >
              Grace Family Church
            </Text>
          </View>
        </View>

        <View
          className="overflow-hidden"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: borderRadius.card,
          }}
        >
          {SETTINGS.map((item, index) => (
            <DetailRow
              key={item.id}
              icon={item.icon}
              tint={item.tint}
              label={item.label}
              showDivider={index < SETTINGS.length - 1}
              onPress={() => router.push(comingSoon(item.label, item.screen))}
            />
          ))}
        </View>

        <SecondaryButton label="Sign Out" onPress={signOut} />
      </ScrollView>
    </View>
  );
}
