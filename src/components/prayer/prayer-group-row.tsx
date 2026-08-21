import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

import { borderRadius } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type PrayerGroupRowProps = {
  name: string;
  icon: IconName;
  tint: string;
  memberCount: number;
  nextSession: string;
  badgeCount: number;
  onPress?: () => void;
};

export function PrayerGroupRow({
  name,
  icon,
  tint,
  memberCount,
  nextSession,
  badgeCount,
  onPress,
}: PrayerGroupRowProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${memberCount} members, next session ${nextSession}`}
      onPress={onPress}
      className="flex-row items-center gap-3 px-3 py-3 active:opacity-80"
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.card,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        className="h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: tint }}
      >
        <MaterialCommunityIcons name={icon} size={21} color="#FFFFFF" />
      </View>

      <View className="flex-1 gap-1">
        <Text
          className="font-figtree-bold text-[15px]"
          style={{ color: colors.text }}
        >
          {name}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text
            className="font-figtree text-[12px]"
            style={{ color: colors.textMuted }}
          >
            {memberCount} Members
          </Text>
          <Text
            className="font-figtree text-[12px]"
            style={{ color: colors.textFaint }}
          >
            •
          </Text>
          <Text
            className="flex-1 font-figtree text-[12px]"
            numberOfLines={1}
            style={{ color: colors.textMuted }}
          >
            Next: {nextSession}
          </Text>
        </View>
      </View>

      <View
        className="h-7 w-7 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.primary }}
      >
        <Text
          className="font-figtree-bold text-[12px]"
          style={{ color: colors.onPrimary }}
        >
          {badgeCount}
        </Text>
      </View>
    </Pressable>
  );
}
