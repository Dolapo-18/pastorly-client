import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/use-app-theme";

type OptionSheetProps = {
  visible: boolean;
  title: string;
  options: readonly string[];
  value?: string | null;
  onSelect: (option: string) => void;
  onClose: () => void;
};

/** Bottom sheet single-select picker backing `SelectField`. */
export function OptionSheet({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
}: OptionSheetProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        onPress={onClose}
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      >
        <Pressable
          onPress={() => {}}
          className="rounded-t-3xl px-6 pt-5"
          style={{
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + 12,
          }}
        >
          <Text
            className="mb-3 font-figtree-bold text-[17px]"
            style={{ color: colors.text }}
          >
            {title}
          </Text>

          <ScrollView className="max-h-[340px]">
            {options.map((option) => {
              const selected = option === value;

              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                  className="flex-row items-center justify-between py-3.5 active:opacity-70"
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <Text
                    className="font-figtree text-[16px]"
                    style={{ color: selected ? colors.primary : colors.text }}
                  >
                    {option}
                  </Text>
                  {selected ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color={colors.primary}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
