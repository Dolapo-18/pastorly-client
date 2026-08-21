import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/use-app-theme";
import { routes } from "@/lib/routes";
import type { BranchEntry } from "@/lib/branches";
import { switchActiveBranch } from "@/features/branch/switch-branch";

type BranchPickerSheetProps = {
  visible: boolean;
  activeBranchId: string | null;
  branches: BranchEntry[];
  loadingBranchId?: string | null;
  onClose: () => void;
  onSelect: (branchId: string) => void;
};

export function BranchPickerSheet({
  visible,
  activeBranchId,
  branches,
  loadingBranchId = null,
  onClose,
  onSelect,
}: BranchPickerSheetProps) {
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
        accessibilityLabel="Dismiss branch picker"
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
            className="mb-1 font-figtree-bold text-[17px]"
            style={{ color: colors.text }}
          >
            Switch branch
          </Text>
          <Text
            className="mb-4 font-figtree text-[13px]"
            style={{ color: colors.textMuted }}
          >
            Choose which church branch you are working in.
          </Text>

          <ScrollView className="max-h-[320px]">
            {branches.map(({ branch, membership }) => {
              const selected = branch.id === activeBranchId;
              const loading = loadingBranchId === branch.id;

              return (
                <Pressable
                  key={branch.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  disabled={loadingBranchId !== null}
                  onPress={() => onSelect(branch.id)}
                  className="flex-row items-center justify-between py-3.5 active:opacity-70"
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <View className="flex-1 pr-3">
                    <Text
                      className="font-figtree-semibold text-[16px]"
                      style={{ color: selected ? colors.primary : colors.text }}
                    >
                      {branch.name}
                    </Text>
                    <Text
                      className="font-figtree text-[12px]"
                      style={{ color: colors.textMuted }}
                    >
                      {[branch.city, branch.country].filter(Boolean).join(", ") ||
                        membership.role}
                    </Text>
                  </View>
                  {selected ? (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color={colors.primary}
                    />
                  ) : loading ? (
                    <Text
                      className="font-figtree text-[12px]"
                      style={{ color: colors.textMuted }}
                    >
                      …
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onClose();
              router.push(routes.myBranches);
            }}
            className="mt-3 flex-row items-center justify-center gap-2 py-3 active:opacity-70"
          >
            <MaterialCommunityIcons
              name="source-branch"
              size={18}
              color={colors.primary}
            />
            <Text
              className="font-figtree-semibold text-[15px]"
              style={{ color: colors.primary }}
            >
              Manage branches
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export async function selectBranchFromPicker(branchId: string, activeBranchId: string | null) {
  if (branchId === activeBranchId) return;
  await switchActiveBranch(branchId);
}
