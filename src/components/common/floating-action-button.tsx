import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type FloatingActionButtonProps = {
  accessibilityLabel: string;
  icon?: IconName;
  onPress?: () => void;
};

export function FloatingActionButton({
  accessibilityLabel,
  icon = "plus",
  onPress,
}: FloatingActionButtonProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className="absolute bottom-5 right-6 h-14 w-14 items-center justify-center rounded-full active:opacity-85"
      style={{
        backgroundColor: colors.primary,
        shadowColor: colors.shadow,
        shadowOpacity: 0.28,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      }}
    >
      <MaterialCommunityIcons name={icon} size={28} color={colors.onPrimary} />
    </Pressable>
  );
}
