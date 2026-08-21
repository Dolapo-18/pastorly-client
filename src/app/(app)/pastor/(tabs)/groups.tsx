import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppScreenHeader } from "@/components/branch";
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
        contentContainerClassName="gap-5"
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 96 }}
      >
        <AppScreenHeader
          title="Groups"
          subtitle={`${prayerGroups.length} groups · ${totalMembers} members`}
        />

        <View className="gap-3 px-6">
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
