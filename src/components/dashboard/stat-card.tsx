import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

import { borderRadius } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { withAlpha } from "@/lib/color";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type StatCardProps = {
  icon: IconName;
  tint: string;
  value: string;
  label: string;
  onPress?: () => void;
};

export function StatCard({ icon, tint, value, label, onPress }: StatCardProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${label}, ${value}`}
      onPress={onPress}
      disabled={!onPress}
      className="flex-1 items-center gap-2 px-2 py-4 active:opacity-75"
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.card,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: withAlpha(tint, isDark ? 0.22 : 0.12) }}
      >
        <MaterialCommunityIcons name={icon} size={19} color={tint} />
      </View>
      <Text
        className="font-figtree-bold text-[22px] leading-[26px]"
        style={{ color: colors.text }}
      >
        {value}
      </Text>
      <Text
        className="text-center font-figtree text-[11px] leading-[14px]"
        style={{ color: colors.textMuted }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
