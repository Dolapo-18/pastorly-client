import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { Pressable } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";
import { goBackOr } from "@/lib/navigation";
import { withAlpha } from "@/lib/color";

type CloseButtonProps = {
  /** Overrides the default dismiss behaviour entirely. */
  onPress?: () => void;
  /** Where to go when there is no history to pop, e.g. from a deep link. */
  fallbackHref?: Href;
};

/** Dismiss affordance for modal sheets, where a back chevron reads wrong. */
export function CloseButton({ onPress, fallbackHref }: CloseButtonProps) {
  const { colors } = useAppTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (fallbackHref) {
      goBackOr(fallbackHref);
      return;
    }
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close"
      hitSlop={12}
      onPress={handlePress}
      className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
      style={{ backgroundColor: withAlpha(colors.text, 0.07) }}
    >
      <MaterialCommunityIcons name="close" size={20} color={colors.textMuted} />
    </Pressable>
  );
}
