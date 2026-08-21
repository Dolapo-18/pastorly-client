import { Pressable, Text } from "react-native";

import { borderRadius } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

type SocialAuthButtonProps = {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
};

export function SocialAuthButton({
  label,
  icon,
  onPress,
}: SocialAuthButtonProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-[52px] flex-row items-center justify-center gap-3 rounded-2xl border active:opacity-80"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.input,
      }}
    >
      {icon}
      <Text
        className="font-figtree-medium text-[16px]"
        style={{ color: colors.text }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function GoogleIcon() {
  return (
    <Text className="font-figtree-bold text-[16px]" style={{ color: "#4285F4" }}>
      G
    </Text>
  );
}
