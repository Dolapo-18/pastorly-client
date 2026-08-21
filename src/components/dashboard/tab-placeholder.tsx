import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";

type TabPlaceholderProps = {
  title: string;
  screenNumber: number;
};

export function TabPlaceholder({ title, screenNumber }: TabPlaceholderProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      className="flex-1 items-center justify-center gap-2 px-8"
      style={{ backgroundColor: colors.background }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <Text
        className="font-figtree-bold text-[22px]"
        style={{ color: colors.text }}
      >
        {title}
      </Text>
      <Text
        className="text-center font-figtree text-[14px]"
        style={{ color: colors.textMuted }}
      >
        Screen {screenNumber} in the mockup — not built yet.
      </Text>
    </View>
  );
}
