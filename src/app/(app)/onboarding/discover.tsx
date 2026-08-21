import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  AuthField,
  AuthScreen,
} from "@/components/auth";
import { FilterChips } from "@/components/common/filter-chips";
import { SecondaryButton } from "@/components/common/secondary-button";
import {
  DISCOVER_NETWORK_FILTERS,
  organizationIdForFilter,
  type DiscoverNetworkFilter,
} from "@/features/branch/discover.data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { joinPolicyLabel, resolveOrganizationName } from "@/lib/branches";
import { routes } from "@/lib/routes";
import { branchService } from "@/services";
import type { Branch } from "@/types/branch";

export default function DiscoverChurchesScreen() {
  const { colors } = useAppTheme();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DiscoverNetworkFilter>("All");
  const [results, setResults] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    void branchService
      .searchBranches(query, organizationIdForFilter(filter))
      .then((items) => {
        if (!cancelled) {
          setResults(items);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResults([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [query, filter]);

  return (
    <AuthScreen showBack backFallbackHref={routes.onboarding}>
      <View className="gap-6">
        <View className="gap-2">
          <Text
            className="font-figtree-bold text-[26px] leading-[34px]"
            style={{ color: colors.text }}
          >
            Find your church
          </Text>
          <Text
            className="font-figtree text-[14px] leading-[20px]"
            style={{ color: colors.textMuted }}
          >
            Browse branches by network, city, or name before you join.
          </Text>
        </View>

        <AuthField
          label="Search"
          placeholder="Church name, city, or network"
          value={query}
          onChangeText={setQuery}
          icon="magnify"
          autoCapitalize="none"
          returnKeyType="search"
        />

        <FilterChips
          options={DISCOVER_NETWORK_FILTERS}
          value={filter}
          onChange={setFilter}
        />

        <View className="gap-3">
          {loading ? (
            <Text
              className="font-figtree text-[14px]"
              style={{ color: colors.textMuted }}
            >
              Searching…
            </Text>
          ) : results.length === 0 ? (
            <View
              className="gap-2 rounded-2xl px-4 py-5"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              }}
            >
              <Text
                className="font-figtree-semibold text-[15px]"
                style={{ color: colors.text }}
              >
                No branches found
              </Text>
              <Text
                className="font-figtree text-[13px] leading-[19px]"
                style={{ color: colors.textMuted }}
              >
                Try another search term or filter, or join with an invite code.
              </Text>
            </View>
          ) : (
            results.map((branch) => (
              <Pressable
                key={branch.id}
                accessibilityRole="button"
                onPress={() => router.push(routes.branchDetail(branch.slug))}
                className="gap-3 rounded-2xl p-4 active:opacity-85"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1 gap-1">
                    <Text
                      className="font-figtree-bold text-[16px]"
                      style={{ color: colors.text }}
                    >
                      {branch.name}
                    </Text>
                    <Text
                      className="font-figtree text-[13px]"
                      style={{ color: colors.textMuted }}
                    >
                      {resolveOrganizationName(branch.organizationId)}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={22}
                    color={colors.textSubtle}
                  />
                </View>

                <Text
                  className="font-figtree text-[13px]"
                  style={{ color: colors.textSubtle }}
                >
                  {[branch.city, branch.country].filter(Boolean).join(", ") ||
                    "Location unavailable"}
                </Text>

                <View
                  className="self-start rounded-full px-3 py-1"
                  style={{ backgroundColor: colors.surfaceMuted }}
                >
                  <Text
                    className="font-figtree-semibold text-[11px]"
                    style={{ color: colors.textMuted }}
                  >
                    {joinPolicyLabel(branch.joinPolicy)}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </View>

        <SecondaryButton
          label="Have an invite code?"
          onPress={() => router.push(routes.onboardingJoin)}
        />
      </View>
    </AuthScreen>
  );
}
