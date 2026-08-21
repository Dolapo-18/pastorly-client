import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { BranchSwitcher } from "@/components/branch";
import { useAppTheme } from "@/hooks/use-app-theme";
import { withAlpha } from "@/lib/color";

type DashboardHeaderProps = {
  greeting: string;
  name: string;
  avatarUri?: string;
  unreadCount?: number;
  onPressAvatar?: () => void;
  onPressNotifications?: () => void;
  showBranchSwitcher?: boolean;
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DashboardHeader({
  greeting,
  name,
  avatarUri,
  unreadCount = 0,
  onPressAvatar,
  onPressNotifications,
  showBranchSwitcher = true,
}: DashboardHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-3">
      <Pressable
        accessibilityRole={onPressAvatar ? "button" : undefined}
        accessibilityLabel="Your profile"
        onPress={onPressAvatar}
        disabled={!onPressAvatar}
        className="h-12 w-12 items-center justify-center overflow-hidden rounded-full active:opacity-75"
        style={{ backgroundColor: withAlpha(colors.primary, 0.16) }}
      >
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={{ height: "100%", width: "100%" }}
            contentFit="cover"
          />
        ) : (
          <Text
            className="font-figtree-bold text-[16px]"
            style={{ color: colors.primary }}
          >
            {initialsOf(name)}
          </Text>
        )}
      </Pressable>

      <View className="flex-1">
        <Text
          className="font-figtree text-[13px]"
          style={{ color: colors.textMuted }}
        >
          {greeting}
        </Text>
        <Text
          className="font-figtree-bold text-[20px] leading-[26px]"
          style={{ color: colors.text }}
        >
          {name} 👋
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        hitSlop={10}
        onPress={onPressNotifications}
        className="h-10 w-10 items-center justify-center"
      >
        <MaterialCommunityIcons
          name="bell-outline"
          size={24}
          color={colors.text}
        />
        {unreadCount > 0 ? (
          <View
            className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: colors.error,
              borderWidth: 1.5,
              borderColor: colors.background,
            }}
          />
        ) : null}
      </Pressable>
      </View>

      {showBranchSwitcher ? <BranchSwitcher variant="header" /> : null}
    </View>
  );
}
