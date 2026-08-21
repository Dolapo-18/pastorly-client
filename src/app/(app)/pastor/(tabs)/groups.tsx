import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FloatingActionButton } from "@/components/common/floating-action-button";
import { PrayerGroupRow } from "@/components/prayer/prayer-group-row";
import { prayerGroups } from "@/features/prayer/prayer-hub.data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { routes } from "@/lib/routes";

export default function PastorGroupsScreen() {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const totalMembers = prayerGroups.reduce(
    (sum, group) => sum + group.memberCount,
    0,
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 px-6"
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 96 }}
      >
        <View className="gap-1">
          <Text
            className="font-figtree-bold text-[26px] leading-[32px]"
            style={{ color: colors.text }}
          >
            Groups
          </Text>
          <Text
            className="font-figtree text-[14px] leading-[20px]"
            style={{ color: colors.textMuted }}
          >
            {prayerGroups.length} groups · {totalMembers} members
          </Text>
        </View>

        <View className="gap-3">
          {prayerGroups.map((group) => (
            <PrayerGroupRow
              key={group.id}
              name={group.name}
              icon={group.icon}
              tint={group.tint}
              memberCount={group.memberCount}
              nextSession={group.nextSession}
              badgeCount={group.badgeCount}
              onPress={() => router.push(routes.groupDetails(group.id))}
            />
          ))}
        </View>
      </ScrollView>

      <FloatingActionButton
        accessibilityLabel="Create prayer group"
        onPress={() => router.push(routes.createGroup)}
      />
    </View>
  );
}
