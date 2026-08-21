import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SecondaryButton } from "@/components/common/secondary-button";
import { useAppTheme } from "@/hooks/use-app-theme";

type ConfirmSheetProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmSheetProps) {
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
          className="gap-4 rounded-t-3xl px-6 pt-5"
          style={{
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + 16,
          }}
        >
          <View className="flex-row items-start gap-3">
            <View
              className="mt-0.5 h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: destructive ? "#FEE2E2" : colors.surfaceMuted,
              }}
            >
              <MaterialCommunityIcons
                name={destructive ? "alert-circle-outline" : "help-circle-outline"}
                size={22}
                color={destructive ? colors.error : colors.primary}
              />
            </View>
            <View className="flex-1 gap-1">
              <Text
                className="font-figtree-bold text-[17px]"
                style={{ color: colors.text }}
              >
                {title}
              </Text>
              <Text
                className="font-figtree text-[14px] leading-[20px]"
                style={{ color: colors.textMuted }}
              >
                {message}
              </Text>
            </View>
          </View>

          <View className="gap-3">
            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={onConfirm}
              className="h-14 items-center justify-center rounded-full active:opacity-80"
              style={{
                backgroundColor: loading
                  ? colors.textFaint
                  : destructive
                    ? colors.error
                    : colors.primary,
              }}
            >
              <Text
                className="font-figtree-bold text-[17px]"
                style={{ color: colors.onPrimary }}
              >
                {loading ? "Working…" : confirmLabel}
              </Text>
            </Pressable>
            <SecondaryButton label={cancelLabel} onPress={onClose} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
