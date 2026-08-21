import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

import { borderRadius } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type SelectFieldProps = {
  label: string;
  placeholder: string;
  value?: string | null;
  onPress?: () => void;
  error?: string | null;
  /** Trailing affordance. Defaults to a dropdown chevron. */
  trailingIcon?: IconName;
};

export function SelectField({
  label,
  placeholder,
  value,
  onPress,
  error,
  trailingIcon = "chevron-down",
}: SelectFieldProps) {
  const { colors } = useAppTheme();

  return (
    <View>
      <Text
        className="mb-2 font-figtree-semibold text-[13px]"
        style={{ color: colors.text }}
      >
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: value ?? placeholder }}
        onPress={onPress}
        className="h-[52px] flex-row items-center justify-between px-5 active:opacity-80"
        style={{
          borderColor: error ? colors.error : colors.border,
          borderWidth: 1,
          backgroundColor: colors.surface,
          borderRadius: borderRadius.button,
        }}
      >
        <Text
          className="flex-1 font-figtree text-[16px]"
          numberOfLines={1}
          style={{ color: value ? colors.text : colors.textSubtle }}
        >
          {value ?? placeholder}
        </Text>
        <MaterialCommunityIcons
          name={trailingIcon}
          size={22}
          color={colors.textSubtle}
        />
      </Pressable>
      {error ? (
        <Text
          accessibilityRole="alert"
          className="ml-3 mt-2 font-figtree-medium text-[13px]"
          style={{ color: colors.error }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
