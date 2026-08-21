import { Text, View } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";
import { withAlpha } from "@/lib/color";

type AvatarStackProps = {
  /** Initials for each visible avatar. */
  initials: string[];
  totalCount: number;
  size?: number;
};

export function AvatarStack({
  initials,
  totalCount,
  size = 36,
}: AvatarStackProps) {
  const { colors } = useAppTheme();
  const overflow = totalCount - initials.length;

  return (
    <View
      className="flex-row items-center"
      accessibilityLabel={`${totalCount} members`}
    >
      {initials.map((value, index) => (
        <View
          key={`${value}-${index}`}
          className="items-center justify-center rounded-full"
          style={{
            height: size,
            width: size,
            marginLeft: index === 0 ? 0 : -size * 0.28,
            backgroundColor: withAlpha(colors.primary, 0.18),
            borderWidth: 2,
            borderColor: colors.background,
          }}
        >
          <Text
            className="font-figtree-semibold text-[12px]"
            style={{ color: colors.primary }}
          >
            {value}
          </Text>
        </View>
      ))}

      {overflow > 0 ? (
        <View
          className="items-center justify-center rounded-full"
          style={{
            height: size,
            width: size,
            marginLeft: -size * 0.28,
            backgroundColor: colors.surfaceStrong,
            borderWidth: 2,
            borderColor: colors.background,
          }}
        >
          <Text
            className="font-figtree-semibold text-[11px]"
            style={{ color: colors.textMuted }}
          >
            +{overflow}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
