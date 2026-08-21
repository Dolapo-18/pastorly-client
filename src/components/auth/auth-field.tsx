import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, type ComponentProps } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

import { fontFamily } from "@/constants/fonts";
import { borderRadius } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type AuthFieldProps = Omit<
  TextInputProps,
  "placeholderTextColor" | "secureTextEntry" | "style"
> & {
  label: string;
  icon?: IconName;
  prefix?: React.ReactNode;
  isPassword?: boolean;
  error?: string | null;
  rounded?: "pill" | "md";
};

export function AuthField({
  label,
  icon,
  prefix,
  isPassword = false,
  error,
  rounded = "pill",
  ...inputProps
}: AuthFieldProps) {
  const { colors } = useAppTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const radius = rounded === "pill" ? borderRadius.button : borderRadius.input;

  return (
    <View>
      <Text
        className="mb-2 font-figtree-semibold text-[13px]"
        style={{ color: colors.text }}
      >
        {label}
      </Text>
      <View
        className={`h-[52px] flex-row items-center border ${
          rounded === "pill" ? "px-5" : "px-4"
        }`}
        style={{
          borderColor: error ? colors.error : colors.border,
          backgroundColor: colors.surface,
          borderRadius: radius,
          overflow: "hidden",
        }}
      >
        {prefix ? (
          <View className="mr-2">{prefix}</View>
        ) : icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={colors.textSubtle}
          />
        ) : null}
        <TextInput
          {...inputProps}
          accessibilityLabel={inputProps.accessibilityLabel ?? label}
          placeholderTextColor={colors.textSubtle}
          secureTextEntry={isPassword && !passwordVisible}
          className={`flex-1 text-[16px] ${icon || prefix ? "ml-3" : ""}`}
          style={{ color: colors.text, fontFamily: fontFamily.regular }}
        />
        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              passwordVisible ? "Hide password" : "Show password"
            }
            hitSlop={12}
            onPress={() => setPasswordVisible((visible) => !visible)}
          >
            <MaterialCommunityIcons
              name={passwordVisible ? "eye-off" : "eye"}
              size={22}
              color={colors.textSubtle}
            />
          </Pressable>
        ) : null}
      </View>
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
