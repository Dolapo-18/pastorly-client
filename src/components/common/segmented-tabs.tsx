import { Pressable, ScrollView, Text, View } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";

type SegmentedTabsProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (option: T) => void;
};

/** Underlined tab row, as used on the Group Details screen. */
export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
}: SegmentedTabsProps<T>) {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex-row"
      style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      {options.map((option) => {
        const selected = option === value;

        return (
          <Pressable
            key={option}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option)}
            className="px-4 pb-3 pt-1 active:opacity-70"
          >
            <Text
              className={
                selected
                  ? "font-figtree-semibold text-[14px]"
                  : "font-figtree text-[14px]"
              }
              style={{ color: selected ? colors.primary : colors.textMuted }}
            >
              {option}
            </Text>
            <View
              className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
              style={{
                backgroundColor: selected ? colors.primary : "transparent",
              }}
            />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
