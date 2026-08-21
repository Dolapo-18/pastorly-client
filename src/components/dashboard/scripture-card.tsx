import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";
import { withAlpha } from "@/lib/color";

type ScriptureCardProps = {
  verse: string;
  reference: string;
};

export function ScriptureCard({ verse, reference }: ScriptureCardProps) {
  const { colors, isDark } = useAppTheme();
  const accentText = isDark ? colors.text : colors.primaryDark;

  return (
    <View
      className="overflow-hidden rounded-3xl px-5 py-5"
      style={{ backgroundColor: colors.scriptureCard }}
    >
      <MaterialCommunityIcons
        name="shimmer"
        size={56}
        color={withAlpha(colors.onDark, isDark ? 0.07 : 0.26)}
        style={{ position: "absolute", right: -4, top: -2 }}
      />
      <Text
        className="font-figtree-semibold text-[15px] leading-[23px]"
        style={{ color: accentText }}
      >
        {verse}
      </Text>
      <Text
        className="mt-2 font-figtree text-[12px]"
        style={{ color: withAlpha(accentText, 0.7) }}
      >
        {reference}
      </Text>
    </View>
  );
}
