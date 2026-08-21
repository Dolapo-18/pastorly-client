import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DetailRow } from "@/components/common/detail-row";
import { SecondaryButton } from "@/components/common/secondary-button";
import { accents, borderRadius } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { withAlpha } from "@/lib/color";
import { comingSoon, routes } from "@/lib/routes";
import { useAuthStore } from "@/store/auth.store";

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const SETTINGS = [
  {
    id: "account",
    icon: "account-circle-outline" as const,
    tint: accents.purple,
    label: "Account profile",
    href: routes.accountProfile,
  },
  {
    id: "church",
    icon: "church" as const,
    tint: accents.purple,
    label: "Church Profile",
    screen: 33 as const,
  },
  {
    id: "notifications",
    icon: "bell-outline" as const,
    tint: accents.coral,
    label: "Notifications",
    screen: 28 as const,
  },
  {
    id: "members",
    icon: "account-group-outline" as const,
    tint: accents.teal,
    label: "Members",
    screen: 19 as const,
  },
  {
    id: "help",
    icon: "help-circle-outline" as const,
    tint: accents.amber,
    label: "Help & Support",
    screen: 40 as const,
  },
] as const;

export default function PastorProfileScreen() {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const session = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);
  const name = session?.user.name ?? "Pastor";

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
              {initialsOf(name)}
            </Text>
          </View>
          <View className="items-center gap-1">
            <Text
              className="font-figtree-bold text-[20px]"
              style={{ color: colors.text }}
            >
              {name}
            </Text>
            <Text
              className="font-figtree text-[13px]"
              style={{ color: colors.textMuted }}
            >
              {session?.user.email}
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
              onPress={() =>
                "href" in item
                  ? router.push(item.href)
                  : router.push(comingSoon(item.label, item.screen))
              }
            />
          ))}
        </View>

        <SecondaryButton label="Sign Out" onPress={() => void signOut()} />
      </ScrollView>
    </View>
  );
}
