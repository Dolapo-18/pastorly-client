import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text } from "react-native";

import { borderRadius, splashPalette } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

type AuthPrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  showArrow?: boolean;
  disabled?: boolean;
  loading?: boolean;
  tone?: "theme" | "brand";
};

export function AuthPrimaryButton({
  label,
  onPress,
  showArrow = false,
  disabled = false,
  loading = false,
  tone = "theme",
}: AuthPrimaryButtonProps) {
  const { colors } = useAppTheme();
  const isDisabled = disabled || loading || !onPress;
  const activeBg =
    tone === "brand" ? splashPalette.primary : colors.primary;
  const disabledBg =
    tone === "brand" ? "rgba(255,255,255,0.25)" : colors.textFaint;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      className="h-14 flex-row items-center justify-center gap-3 rounded-full active:opacity-80"
      style={{
        backgroundColor: isDisabled ? disabledBg : activeBg,
        borderRadius: borderRadius.button,
        overflow: "hidden",
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.onPrimary} />
      ) : (
        <Text
          className="font-figtree-bold text-[17px]"
          style={{ color: colors.onPrimary }}
        >
          {label}
        </Text>
      )}
      {showArrow && !loading ? (
        <MaterialCommunityIcons
          name="arrow-right"
          size={22}
          color={colors.onPrimary}
        />
      ) : null}
    </Pressable>
  );
}
