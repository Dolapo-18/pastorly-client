import Svg, { Circle, Path } from "react-native-svg";

type PastorlyLogoProps = {
  size?: number;
  color?: string;
  crossColor?: string;
  showRing?: boolean;
  ringColor?: string;
  variant?: "filled" | "outline";
  weight?: "regular" | "bold";
};

export function PastorlyLogo({
  size = 88,
  color = "#FFFFFF",
  crossColor = "#3F2B96",
  showRing = true,
  ringColor,
  variant = "filled",
  weight = "regular",
}: PastorlyLogoProps) {
  const ringSize = size * 1.55;
  const ringStroke = ringColor ?? color;
  const isBold = weight === "bold";
  const ringStrokeWidth = isBold ? 2.25 : 1.25;
  const ringOpacity = isBold ? 0.62 : 0.4;
  const crossStrokeWidth = isBold ? 3.75 : 2.75;
  const heartStrokeWidth = isBold ? 2 : 2.5;

  return (
    <Svg width={ringSize} height={ringSize} viewBox="0 0 120 120" fill="none">
      {showRing ? (
        <Circle
          cx="60"
          cy="60"
          r="52"
          stroke={ringStroke}
          strokeWidth={ringStrokeWidth}
          strokeOpacity={ringOpacity}
          fill="none"
        />
      ) : null}
      {variant === "filled" ? (
        <Path
          d="M60 86c-17-13.5-26.5-25-26.5-38.5a15.5 15.5 0 0 1 26.5-9.5 15.5 15.5 0 0 1 26.5 9.5c0 13.5-9.5 25-26.5 38.5z"
          fill={color}
          stroke={isBold ? color : undefined}
          strokeWidth={isBold ? 1.5 : 0}
        />
      ) : (
        <Path
          d="M60 86c-17-13.5-26.5-25-26.5-38.5a15.5 15.5 0 0 1 26.5-9.5 15.5 15.5 0 0 1 26.5 9.5c0 13.5-9.5 25-26.5 38.5z"
          stroke={color}
          strokeWidth={heartStrokeWidth}
          fill="none"
        />
      )}
      <Path
        d="M60 39v20M50 49h20"
        stroke={variant === "filled" ? crossColor : color}
        strokeWidth={crossStrokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
