import { Text, TextInput, View, type TextInputProps } from "react-native";

import { fontFamily } from "@/constants/fonts";
import { useAppTheme } from "@/hooks/use-app-theme";

type TextAreaFieldProps = Omit<
  TextInputProps,
  "placeholderTextColor" | "multiline" | "style"
> & {
  label: string;
  /** Visible lines before the field scrolls. */
  rows?: number;
};

export function TextAreaField({
  label,
  rows = 3,
  ...inputProps
}: TextAreaFieldProps) {
  const { colors } = useAppTheme();

  return (
    <View>
      <Text
        className="mb-2 font-figtree-semibold text-[13px]"
        style={{ color: colors.text }}
      >
        {label}
      </Text>
      <TextInput
        {...inputProps}
        accessibilityLabel={inputProps.accessibilityLabel ?? label}
        multiline
        textAlignVertical="top"
        placeholderTextColor={colors.textSubtle}
        className="px-5 py-4 text-[16px]"
        style={{
          minHeight: rows * 24 + 32,
          color: colors.text,
          fontFamily: fontFamily.regular,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 22,
        }}
      />
    </View>
  );
}
