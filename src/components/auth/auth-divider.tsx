import { Text, View } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";

type AuthDividerProps = {
  label?: string;
};

export function AuthDivider({ label = "or" }: AuthDividerProps) {
  const { colors } = useAppTheme();

  return (
    <View className="my-2 flex-row items-center gap-4">
      <View className="h-px flex-1" style={{ backgroundColor: colors.border }} />
      <Text
        className="font-figtree-semibold text-[11px] tracking-[2px]"
        style={{ color: colors.textSubtle }}
      >
        {label.toUpperCase()}
      </Text>
      <View className="h-px flex-1" style={{ backgroundColor: colors.border }} />
    </View>
  );
}
