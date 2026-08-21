import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { Pressable } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";
import { goBackOr } from "@/lib/navigation";

type BackButtonProps = {
  /** Overrides the default navigation behaviour entirely. */
  onPress?: () => void;
  /**
   * Where to go when there is no history to pop — for example when the screen
   * was opened from a deep link or a notification.
   */
  fallbackHref?: Href;
  color?: string;
};

export function BackButton({ onPress, fallbackHref, color }: BackButtonProps) {
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
      accessibilityLabel="Go back"
      hitSlop={12}
      onPress={handlePress}
      className="-ml-2 h-10 w-10 items-center justify-center active:opacity-70"
    >
      <MaterialCommunityIcons
        name="chevron-left"
        size={30}
        color={color ?? colors.text}
      />
    </Pressable>
  );
}
