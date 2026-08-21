import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FilterChips } from "@/components/common/filter-chips";
import { FloatingActionButton } from "@/components/common/floating-action-button";
import { SecondaryButton } from "@/components/common/secondary-button";
import { SectionHeader } from "@/components/common/section-header";
import { PrayerGroupRow } from "@/components/prayer/prayer-group-row";
import {
  PRAYER_HUB_FILTERS,
  prayerGroups,
  type PrayerHubFilter,
} from "@/features/prayer/prayer-hub.data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { comingSoon, routes } from "@/lib/routes";

export default function PrayerHubScreen() {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<PrayerHubFilter>("All");
  const showsGroups = filter === "All" || filter === "Groups";

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5"
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: 96,
        }}
      >
        <View className="flex-row items-start justify-between px-6">
          <View className="flex-1 gap-1">
            <Text
              className="font-figtree-bold text-[26px] leading-[32px]"
              style={{ color: colors.text }}
            >
              Prayer Hub
            </Text>
            <Text
              className="font-figtree text-[14px] leading-[20px]"
              style={{ color: colors.textMuted }}
            >
              Manage prayers, groups and sessions.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Prayer settings"
            hitSlop={10}
            onPress={() => router.push(comingSoon("Prayer Settings", 36))}
            className="h-9 w-9 items-center justify-center active:opacity-70"
          >
            <MaterialCommunityIcons
              name="cog-outline"
              size={22}
              color={colors.textMuted}
            />
          </Pressable>
        </View>

        <View className="pl-6">
          <FilterChips
            options={PRAYER_HUB_FILTERS}
            value={filter}
            onChange={setFilter}
          />
        </View>

        {showsGroups ? (
          <View className="gap-3 px-6">
            <SectionHeader
              title="My Prayer Groups"
              actionLabel="View All"
              onPressAction={() => router.push(routes.pastorGroups)}
            />
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
        ) : (
          <View className="items-center gap-2 px-10 py-14">
            <Text
              className="font-figtree-semibold text-[15px]"
              style={{ color: colors.text }}
            >
              {filter}
            </Text>
            <Text
              className="text-center font-figtree text-[13px] leading-[19px]"
              style={{ color: colors.textMuted }}
            >
              Nothing here yet — this list is part of a later mockup screen.
            </Text>
          </View>
        )}

        <View className="px-6">
          <SecondaryButton
            label="Schedule a Prayer Meeting"
            onPress={() => router.push(routes.scheduleMeeting)}
          />
        </View>
      </ScrollView>

      <FloatingActionButton
        accessibilityLabel="Create prayer group"
        onPress={() => router.push(routes.createGroup)}
      />
    </View>
  );
}
