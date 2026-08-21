import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useAppTheme } from "@/hooks/use-app-theme";

type ImageUploadCircleProps = {
  label: string;
  size?: number;
  imageUri?: string | null;
  onPress?: () => void;
};

/**
 * Dashed circular image picker target.
 * The ring is drawn with SVG because React Native ignores
 * `borderStyle: "dashed"` once `borderRadius` is applied on iOS.
 */
export function ImageUploadCircle({
  label,
  size = 116,
  imageUri,
  onPress,
}: ImageUploadCircleProps) {
  const { colors } = useAppTheme();
  const radius = size / 2 - 1;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="items-center justify-center active:opacity-70"
      style={{ height: size, width: size }}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ height: size, width: size, borderRadius: size / 2 }}
          contentFit="cover"
        />
      ) : (
        <>
          <Svg
            width={size}
            height={size}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.textFaint}
              strokeWidth={1.5}
              strokeDasharray="5 5"
              fill="none"
            />
          </Svg>
          <View className="px-6">
            <Text
              className="text-center font-figtree text-[13px] leading-[18px]"
              style={{ color: colors.textMuted }}
            >
              {label}
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
}
