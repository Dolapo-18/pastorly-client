import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ScriptureCard } from "@/components/dashboard/scripture-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { BranchSwitcher } from "@/components/branch";
import {
  dailyScripture,
  greetingForHour,
  pastorDashboardStats,
  pastorProfile,
} from "@/features/dashboard/pastor-dashboard.data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { comingSoon, routes } from "@/lib/routes";

export default function PastorHomeScreen() {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const greeting = greetingForHour(new Date().getHours());

  const rows = [
    pastorDashboardStats.slice(0, 3),
    pastorDashboardStats.slice(3, 6),
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-6 px-6"
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: 28,
        }}
      >
        <DashboardHeader
          greeting={greeting}
          name={pastorProfile.name}
          unreadCount={pastorProfile.unreadNotifications}
          onPressAvatar={() => router.push(routes.pastorProfile)}
          onPressNotifications={() =>
            router.push(comingSoon("Notifications", 28))
          }
        />

        <BranchSwitcher />

        <Text
          className="font-figtree text-[15px] leading-[22px]"
          style={{ color: colors.textMuted }}
        >
          Here&apos;s what needs your attention today.
        </Text>

        <View className="gap-3">
          {rows.map((row, index) => (
            <View key={index} className="flex-row gap-3">
              {row.map((stat) => (
                <StatCard
                  key={stat.id}
                  icon={stat.icon}
                  tint={stat.tint}
                  value={stat.value}
                  label={stat.label}
                  onPress={() => router.push(stat.href)}
                />
              ))}
            </View>
          ))}
        </View>

        <ScriptureCard
          verse={dailyScripture.verse}
          reference={dailyScripture.reference}
        />
      </ScrollView>
    </View>
  );
}
