import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthPrimaryButton } from "@/components/auth";
import { AvatarStack } from "@/components/common/avatar-stack";
import { BackButton } from "@/components/common/back-button";
import { DetailRow } from "@/components/common/detail-row";
import { SecondaryButton } from "@/components/common/secondary-button";
import { SegmentedTabs } from "@/components/common/segmented-tabs";
import { borderRadius } from "@/constants/theme";
import {
  GROUP_DETAIL_TABS,
  getGroupDetails,
  type GroupDetailTab,
} from "@/features/prayer/group-details.data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { comingSoon, routes } from "@/lib/routes";

export default function GroupDetailsScreen() {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState<GroupDetailTab>("Overview");
  const group = getGroupDetails(id ?? "");

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View className="flex-row items-center justify-between px-6">
          <BackButton fallbackHref={routes.prayerHub} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Group information"
            hitSlop={10}
            onPress={() =>
              router.push(comingSoon(`${group.name} Info`, 22))
            }
            className="h-10 w-10 items-center justify-center active:opacity-70"
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={22}
              color={colors.textMuted}
            />
          </Pressable>
        </View>

        <View className="items-center gap-3 px-6 pt-1">
          <View
            className="h-[76px] w-[76px] items-center justify-center rounded-full"
            style={{ backgroundColor: group.tint }}
          >
            <MaterialCommunityIcons
              name={group.icon}
              size={34}
              color="#FFFFFF"
            />
          </View>

          <View className="items-center gap-1">
            <Text
              className="font-figtree-bold text-[21px]"
              style={{ color: colors.text }}
            >
              {group.name}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text
                className="font-figtree text-[13px]"
                style={{ color: colors.textMuted }}
              >
                {group.memberCount} Members
              </Text>
              <Text
                className="font-figtree text-[13px]"
                style={{ color: colors.textFaint }}
              >
                •
              </Text>
              <Text
                className="font-figtree-medium text-[13px]"
                style={{ color: colors.success }}
              >
                {group.status}
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View members"
            onPress={() => setTab("Members")}
            className="active:opacity-70"
          >
            <AvatarStack
              initials={group.memberInitials}
              totalCount={group.memberCount}
            />
          </Pressable>
        </View>

        <View className="mt-5 px-6">
          <SegmentedTabs
            options={GROUP_DETAIL_TABS}
            value={tab}
            onChange={setTab}
          />
        </View>

        <View className="px-6 pt-5">
          {tab === "Overview" ? (
            <View
              className="overflow-hidden"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: borderRadius.card,
              }}
            >
              {group.overview.map((row, index) => (
                <DetailRow
                  key={row.id}
                  icon={row.icon}
                  tint={row.tint}
                  label={row.label}
                  subtitle={row.subtitle}
                  value={row.value}
                  showDivider={index < group.overview.length - 1}
                  onPress={
                    row.id === "next-session"
                      ? () => router.push(routes.scheduleMeeting)
                      : () => router.push(comingSoon(row.label))
                  }
                />
              ))}
            </View>
          ) : (
            <View
              className="items-center justify-center gap-2 py-12"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: borderRadius.card,
              }}
            >
              <Text
                className="font-figtree-semibold text-[15px]"
                style={{ color: colors.text }}
              >
                {tab}
              </Text>
              <Text
                className="text-center font-figtree text-[13px]"
                style={{ color: colors.textMuted }}
              >
                Not built yet — this tab is part of a later mockup screen.
              </Text>
            </View>
          )}
        </View>

        <View className="gap-3 px-6 pt-6">
          <AuthPrimaryButton
            label="Start Session"
            onPress={() => router.push(comingSoon("Live Prayer Room", 11))}
          />
          <SecondaryButton
            label="Manage Group"
            onPress={() => router.push(comingSoon("Manage Group", 34))}
          />
        </View>
      </ScrollView>
    </View>
  );
}
