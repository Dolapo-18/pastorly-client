import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RoleCard } from "@/components/auth";
import { SecondaryButton } from "@/components/common/secondary-button";
import { Screen } from "@/components/common/screen";
import { useAppTheme } from "@/hooks/use-app-theme";
import { homeForRole } from "@/features/auth";
import { useAuthStore } from "@/store/auth.store";

export default function OnboardingScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const session = useAuthStore((state) => state.session);
  const memberships = useAuthStore((state) => state.memberships);
  const signOut = useAuthStore((state) => state.signOut);

  const pending = memberships.filter((item) => item.status === "pending");

  return (
    <Screen className="px-7" edges={false} style={{ paddingTop: insets.top + 16 }}>
      <View className="flex-1 justify-between pb-8">
        <View className="gap-8">
          <View className="gap-2">
            <Text
              className="font-figtree-bold text-[26px] leading-[34px]"
              style={{ color: colors.text }}
            >
              Connect to a church
            </Text>
            <Text
              className="font-figtree text-[14px] leading-[20px]"
              style={{ color: colors.textMuted }}
            >
              {session?.user.name
                ? `Welcome, ${session.user.name}. Join a branch or set one up to continue.`
                : "Join a branch or set one up to continue."}
            </Text>
          </View>

          {pending.length > 0 ? (
            <View
              className="gap-2 rounded-2xl px-4 py-4"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              }}
            >
              <Text
                className="font-figtree-semibold text-[14px]"
                style={{ color: colors.text }}
              >
                Pending approval
              </Text>
              <Text
                className="font-figtree text-[13px] leading-[19px]"
                style={{ color: colors.textMuted }}
              >
                You have {pending.length} branch request
                {pending.length === 1 ? "" : "s"} awaiting approval. You can
                join another branch or wait for a pastor to approve you.
              </Text>
            </View>
          ) : null}

          <View className="gap-4">
            <RoleCard
              title="Find your church"
              description="Join an existing branch with an invite code or QR scan."
              icon="people-outline"
              selected={false}
              onPress={() => router.push("/(app)/onboarding/join-church")}
            />
            <RoleCard
              title="Set up a church / branch"
              description="Register a new branch and become its admin after approval."
              icon="person-outline"
              selected={false}
              onPress={() => router.push("/(app)/onboarding/setup-branch")}
            />
          </View>
        </View>

        <View className="gap-3">
          <SecondaryButton
            label="Edit global profile"
            onPress={() => router.push("/(app)/account/profile")}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => void signOut()}
            className="items-center py-2 active:opacity-70"
          >
            <Text
              className="font-figtree-medium text-[14px]"
              style={{ color: colors.textMuted }}
            >
              Sign out
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
