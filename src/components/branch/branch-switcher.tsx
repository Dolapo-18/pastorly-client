import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { useActiveBranch } from "@/hooks/use-active-branch";
import { useMyBranches } from "@/hooks/use-my-branches";
import { useAppTheme } from "@/hooks/use-app-theme";
import { routes } from "@/lib/routes";
import { useAuthStore } from "@/store/auth.store";
import { useBranchStore } from "@/store/branch.store";

export function BranchSwitcher() {
  const { colors } = useAppTheme();
  const { activeBranch, setActiveBranch } = useActiveBranch();
  const { myBranches, hasMultiple } = useMyBranches();
  const [open, setOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (!activeBranch) return null;

  if (!hasMultiple) {
    return (
      <View
        className="self-start rounded-full px-4 py-2"
        style={{ backgroundColor: colors.surface }}
      >
        <Text
          className="font-figtree-semibold text-[13px]"
          style={{ color: colors.textMuted }}
        >
          {activeBranch.name}
        </Text>
      </View>
    );
  }

  const handleSelect = async (branchId: string) => {
    if (branchId === activeBranch.id) {
      setOpen(false);
      return;
    }

    setLoadingId(branchId);
    try {
      await setActiveBranch(branchId);
      useAuthStore.setState({
        role: useBranchStore.getState().roleAtActiveBranch,
      });
      setOpen(false);
      router.replace(routes.dashboard);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <View className="gap-2">
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((value) => !value)}
        className="flex-row items-center gap-2 self-start rounded-full px-4 py-2 active:opacity-80"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
        }}
      >
        <MaterialCommunityIcons name="church" size={16} color={colors.primary} />
        <Text
          className="font-figtree-semibold text-[13px]"
          style={{ color: colors.text }}
        >
          {activeBranch.name}
        </Text>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textMuted}
        />
      </Pressable>

      {open ? (
        <View
          className="gap-1 rounded-2xl p-2"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
          }}
        >
          {myBranches.map(({ branch }) => {
            const selected = branch.id === activeBranch.id;
            return (
              <Pressable
                key={branch.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                disabled={loadingId !== null}
                onPress={() => void handleSelect(branch.id)}
                className="flex-row items-center justify-between rounded-xl px-3 py-3 active:opacity-80"
                style={{
                  backgroundColor: selected ? colors.surfaceMuted : "transparent",
                }}
              >
                <View>
                  <Text
                    className="font-figtree-semibold text-[14px]"
                    style={{ color: colors.text }}
                  >
                    {branch.name}
                  </Text>
                  <Text
                    className="font-figtree text-[12px]"
                    style={{ color: colors.textMuted }}
                  >
                    {[branch.city, branch.country].filter(Boolean).join(", ") ||
                      "Branch"}
                  </Text>
                </View>
                {selected ? (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={18}
                    color={colors.primary}
                  />
                ) : loadingId === branch.id ? (
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
        </View>
      ) : null}
    </View>
  );
}
