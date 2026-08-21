import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";
import { withAlpha } from "@/lib/color";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type DetailRowProps = {
  icon: IconName;
  tint: string;
  label: string;
  /** Secondary line under the label. */
  subtitle?: string;
  /** Right-aligned value or meta text. */
  value?: string;
  showDivider?: boolean;
  onPress?: () => void;
};

export function DetailRow({
  icon,
  tint,
  label,
  subtitle,
  value,
  showDivider = true,
  onPress,
}: DetailRowProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${label}${value ? `, ${value}` : ""}`}
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-3 px-4 py-3.5 active:opacity-70"
      style={{
        borderBottomWidth: showDivider ? 1 : 0,
        borderBottomColor: colors.border,
      }}
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: withAlpha(tint, isDark ? 0.22 : 0.12) }}
      >
        <MaterialCommunityIcons name={icon} size={18} color={tint} />
      </View>

      <View className="flex-1">
        <Text
          className="font-figtree-semibold text-[14px]"
          style={{ color: colors.text }}
        >
          {label}
        </Text>
        {subtitle ? (
          <Text
            className="mt-0.5 font-figtree text-[12px]"
            style={{ color: colors.textMuted }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {value ? (
        <Text
          className="font-figtree-semibold text-[14px]"
          style={{ color: colors.textMuted }}
        >
          {value}
        </Text>
      ) : null}
    </Pressable>
  );
}
