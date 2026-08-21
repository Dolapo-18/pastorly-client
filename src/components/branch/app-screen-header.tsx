import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { BranchSwitcher } from "@/components/branch/branch-switcher";
import { useAppTheme } from "@/hooks/use-app-theme";

type AppScreenHeaderProps = {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
};

/** Shared top header with branch switcher for authenticated app screens. */
export function AppScreenHeader({
  title,
  subtitle,
  trailing,
}: AppScreenHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <View className="gap-3 px-6">
      <View className="flex-row items-center justify-between gap-3">
        <BranchSwitcher variant="header" />
        {trailing}
      </View>
      <View className="gap-1">
        <Text
          className="font-figtree-bold text-[24px] leading-[30px]"
          style={{ color: colors.text }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            className="font-figtree text-[14px] leading-[20px]"
            style={{ color: colors.textMuted }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
