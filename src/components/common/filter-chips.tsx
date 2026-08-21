import { Pressable, ScrollView, Text } from "react-native";

import { borderRadius } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

type FilterChipsProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (option: T) => void;
};

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: FilterChipsProps<T>) {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex-row gap-2"
    >
      {options.map((option) => {
        const selected = option === value;

        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option)}
            className="h-9 justify-center px-5 active:opacity-80"
            style={{
              backgroundColor: selected ? colors.primary : colors.surfaceStrong,
              borderRadius: borderRadius.button,
            }}
          >
            <Text
              className="font-figtree-semibold text-[13px]"
              style={{ color: selected ? colors.onPrimary : colors.textMuted }}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
