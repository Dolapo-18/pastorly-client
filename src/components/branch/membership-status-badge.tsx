import { Text, View } from "react-native";

import { accents } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { membershipStatusLabel } from "@/lib/branches";
import type { MembershipStatus } from "@/types/branch";

type MembershipStatusBadgeProps = {
  status: MembershipStatus;
};

export function MembershipStatusBadge({ status }: MembershipStatusBadgeProps) {
  const { colors } = useAppTheme();

  const palette =
    status === "active"
      ? { bg: colors.successSoft, text: colors.success }
      : status === "pending"
        ? { bg: "#FEF3C7", text: accents.amber }
        : { bg: colors.surfaceMuted, text: colors.textMuted };

  return (
    <View
      className="rounded-full px-2.5 py-1"
      style={{ backgroundColor: palette.bg }}
    >
      <Text
        className="font-figtree-semibold text-[11px]"
        style={{ color: palette.text }}
      >
        {membershipStatusLabel(status)}
      </Text>
    </View>
  );
}
