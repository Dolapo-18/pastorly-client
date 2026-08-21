import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DetailRow } from "@/components/common/detail-row";
import { FloatingActionButton } from "@/components/common/floating-action-button";
import { accents, borderRadius } from "@/constants/theme";
import { prayerGroups } from "@/features/prayer/prayer-hub.data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { routes } from "@/lib/routes";

export default function PastorCalendarScreen() {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

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
            Calendar
          </Text>
          <Text
            className="font-figtree text-[14px] leading-[20px]"
            style={{ color: colors.textMuted }}
          >
            Upcoming prayer sessions.
          </Text>
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
          {prayerGroups.map((group, index) => (
            <DetailRow
              key={group.id}
              icon="calendar-clock"
              tint={accents.purple}
              label={group.name}
              subtitle={group.nextSession}
              showDivider={index < prayerGroups.length - 1}
              onPress={() => router.push(routes.groupDetails(group.id))}
            />
          ))}
        </View>
      </ScrollView>

      <FloatingActionButton
        accessibilityLabel="Schedule prayer meeting"
        icon="calendar-plus"
        onPress={() => router.push(routes.scheduleMeeting)}
      />
    </View>
  );
}
