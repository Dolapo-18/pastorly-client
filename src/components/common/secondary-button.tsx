import { Pressable, Text } from "react-native";

import { borderRadius } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

type SecondaryButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

/** Outlined pill button — the "Secondary Button" in the mockup design system. */
export function SecondaryButton({
  label,
  onPress,
  disabled = false,
}: SecondaryButtonProps) {
  const { colors } = useAppTheme();
  const isDisabled = disabled || !onPress;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      className="h-14 items-center justify-center active:opacity-80"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: borderRadius.button,
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      <Text
        className="font-figtree-semibold text-[16px]"
        style={{ color: colors.primary }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
