import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import {
  AuthField,
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth";
import { homeForRole } from "@/features/auth";
import { useAppTheme } from "@/hooks/use-app-theme";
import { authService } from "@/services";
import { membershipService } from "@/services/membership.service";
import { useAuthStore } from "@/store/auth.store";

export default function SetupBranchScreen() {
  const { colors } = useAppTheme();
  const session = useAuthStore((state) => state.session);
  const refreshMemberships = useAuthStore((state) => state.refreshMemberships);
  const setSessionUser = useAuthStore((state) => state.setSessionUser);
  const [churchName, setChurchName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [pastorName, setPastorName] = useState(session?.user.name ?? "");
  const [email, setEmail] = useState(session?.user.email ?? "");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setError(null);
    if (!churchName.trim()) {
      setError("Enter your church or branch name.");
      return;
    }

    setLoading(true);
    try {
      if (pastorName.trim() && session) {
        const profile = await authService.updateProfile({
          name: pastorName.trim(),
          email: email.trim(),
        });
        setSessionUser({ ...session.user, ...profile });
      }

      await membershipService.createPastorBranch({
        churchName: churchName.trim(),
        city: city.trim() || undefined,
        country: country.trim() || undefined,
      });
      await refreshMemberships();
      router.replace(homeForRole("pastor"));
    } catch {
      setError("Could not save your branch. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      showBack
      backFallbackHref="/(app)/onboarding"
      contentClassName="justify-between"
    >
      <View className="gap-7">
        <View className="gap-2">
          <Text
            className="font-figtree-bold text-[28px] leading-[36px]"
            style={{ color: colors.text }}
          >
            Let&apos;s set up{"\n"}your church
          </Text>
          <Text
            className="font-figtree-medium text-[14px]"
            style={{ color: colors.textMuted }}
          >
            Step 1 of 4 — branch details
          </Text>
        </View>

        <View className="gap-4">
          <AuthField
            label="Church / Branch Name"
            placeholder="Grace Family Church"
            value={churchName}
            onChangeText={setChurchName}
          />
          <AuthField
            label="City"
            placeholder="Lagos"
            value={city}
            onChangeText={setCity}
          />
          <AuthField
            label="Country"
            placeholder="Nigeria"
            value={country}
            onChangeText={setCountry}
          />
          <AuthField
            label="Pastor Name"
            placeholder="Pastor John Samuel"
            value={pastorName}
            onChangeText={setPastorName}
          />
          <AuthField
            label="Email"
            placeholder="pastorjohn@gracefamily.org"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AuthField
            label="Phone Number"
            placeholder="+234 801 234 5678"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          {error ? (
            <Text
              accessibilityRole="alert"
              className="font-figtree-medium text-[13px]"
              style={{ color: colors.error }}
            >
              {error}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="pt-6">
        <AuthPrimaryButton
          label={loading ? "Saving…" : "Continue"}
          disabled={loading}
          onPress={() => void handleContinue()}
        />
      </View>
    </AuthScreen>
  );
}
