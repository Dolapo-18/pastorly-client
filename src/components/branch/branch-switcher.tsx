import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  BranchPickerSheet,
  selectBranchFromPicker,
} from "@/components/branch/branch-picker-sheet";
import { useActiveBranch } from "@/hooks/use-active-branch";
import { useMyBranches } from "@/hooks/use-my-branches";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuthStore } from "@/store/auth.store";

type BranchSwitcherProps = {
  variant?: "header" | "inline";
};

export function BranchSwitcher({ variant = "inline" }: BranchSwitcherProps) {
  const { colors } = useAppTheme();
  const { activeBranch, activeBranchId } = useActiveBranch();
  const { myBranches } = useMyBranches();
  const pendingCount = useAuthStore(
    (state) => state.memberships.filter((item) => item.status === "pending").length,
  );
  const [open, setOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (!activeBranch) return null;

  const handleSelect = async (branchId: string) => {
    if (branchId === activeBranch.id) {
      setOpen(false);
      return;
    }

    setLoadingId(branchId);
    try {
      await selectBranchFromPicker(branchId, activeBranchId);
      setOpen(false);
    } finally {
      setLoadingId(null);
    }
  };

  const isHeader = variant === "header";

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Current branch ${activeBranch.name}`}
        onPress={() => setOpen(true)}
        className={`flex-row items-center gap-2 active:opacity-80 ${
          isHeader ? "self-start" : "self-start"
        }`}
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 999,
          paddingHorizontal: isHeader ? 12 : 16,
          paddingVertical: isHeader ? 8 : 10,
        }}
      >
        <MaterialCommunityIcons
          name="church"
          size={isHeader ? 15 : 16}
          color={colors.primary}
        />
        <Text
          className={`font-figtree-semibold ${isHeader ? "text-[12px]" : "text-[13px]"}`}
          style={{ color: colors.text }}
          numberOfLines={1}
        >
          {activeBranch.name}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={isHeader ? 16 : 18}
          color={colors.textMuted}
        />
        {pendingCount > 0 ? (
          <View
            className="ml-0.5 h-2 w-2 rounded-full"
            style={{ backgroundColor: colors.error }}
          />
        ) : null}
      </Pressable>

      <BranchPickerSheet
        visible={open}
        activeBranchId={activeBranchId}
        branches={myBranches}
        loadingBranchId={loadingId}
        onClose={() => setOpen(false)}
        onSelect={(branchId) => void handleSelect(branchId)}
      />
    </>
  );
}
