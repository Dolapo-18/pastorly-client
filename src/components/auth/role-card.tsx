import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { borderRadius } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

type RoleCardProps = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  onPress: () => void;
};

export function RoleCard({
  title,
  description,
  icon,
  selected,
  onPress,
}: RoleCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className="flex-row items-start gap-4 border p-5 active:opacity-90"
      style={{
        borderRadius: borderRadius.card,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.surfaceMuted : colors.surface,
      }}
    >
      <View
        className="h-11 w-11 items-center justify-center rounded-xl"
        style={{
          backgroundColor: selected ? colors.lavender : colors.surfaceStrong,
        }}
      >
        <Ionicons
          name={icon}
          size={22}
          color={selected ? colors.primary : colors.textSubtle}
        />
      </View>
      <View className="flex-1 gap-1">
        <Text
          className="font-figtree-bold text-[17px]"
          style={{ color: colors.text }}
        >
          {title}
        </Text>
        <Text
          className="font-figtree text-[14px] leading-5"
          style={{ color: colors.textMuted }}
        >
          {description}
        </Text>
      </View>
    </Pressable>
  );
}
