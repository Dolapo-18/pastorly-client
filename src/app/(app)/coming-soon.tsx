import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackButton } from "@/components/common/back-button";
import { useAppTheme } from "@/hooks/use-app-theme";
import { withAlpha } from "@/lib/color";

/**
 * Destination for actions whose target screen is not built yet, so no button in
 * the app is inert. Pass `title` and optionally `screen` (mockup number).
 */
export default function ComingSoonScreen() {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { title, screen } = useLocalSearchParams<{
    title?: string;
    screen?: string;
  }>();

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: colors.background, paddingTop: insets.top + 8 }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <View className="px-6">
        <BackButton fallbackHref="/(app)/pastor/(tabs)/home" />
      </View>

      <View className="flex-1 items-center justify-center gap-3 px-10">
        <View
          className="h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: withAlpha(colors.primary, 0.12) }}
        >
          <MaterialCommunityIcons
            name="hammer-wrench"
            size={28}
            color={colors.primary}
          />
        </View>
        <Text
          className="text-center font-figtree-bold text-[22px]"
          style={{ color: colors.text }}
        >
          {title ?? "Coming soon"}
        </Text>
        <Text
          className="text-center font-figtree text-[14px] leading-[20px]"
          style={{ color: colors.textMuted }}
        >
          {screen
            ? `Screen ${screen} in the mockup — not built yet.`
            : "This screen is not built yet."}
        </Text>
      </View>
    </View>
  );
}
