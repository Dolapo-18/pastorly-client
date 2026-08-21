import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { RoleCard, AuthField, AuthPrimaryButton, AuthScreen } from "@/components/auth";
import { DetailRow } from "@/components/common/detail-row";
import { accents } from "@/constants/theme";
import {
  SETUP_NETWORK_OPTIONS,
  SETUP_STEP_LABELS,
  SETUP_WIZARD_STEPS,
  pastorFullName,
  setupStepNumber,
  splitPastorName,
  type BranchSetupDraft,
  type SetupWizardStep,
} from "@/features/branch/setup-branch.data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { resolveOrganizationName } from "@/lib/branches";
import { routes } from "@/lib/routes";
import { authService, branchService } from "@/services";
import { useAuthStore } from "@/store/auth.store";

const EMPTY_DRAFT = (defaults: Partial<BranchSetupDraft>): BranchSetupDraft => ({
  organizationId: "",
  branchName: "",
  address: "",
  city: "",
  country: "",
  pastorFirstName: defaults.pastorFirstName ?? "",
  pastorLastName: defaults.pastorLastName ?? "",
  email: defaults.email ?? "",
  phone: "",
});

export default function SetupBranchWizardScreen() {
  const { colors } = useAppTheme();
  const session = useAuthStore((state) => state.session);
  const setSessionUser = useAuthStore((state) => state.setSessionUser);
  const [step, setStep] = useState<SetupWizardStep>("network");
  const [draft, setDraft] = useState<BranchSetupDraft>(() =>
    EMPTY_DRAFT({
      email: session?.user.email,
      ...splitPastorName(session?.user.name),
    }),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const stepIndex = SETUP_WIZARD_STEPS.indexOf(step);
  const isFirstStep = stepIndex === 0;
  const isReviewStep = step === "review";

  const updateDraft = (patch: Partial<BranchSetupDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const validateStep = (): string | null => {
    switch (step) {
      case "network":
        return draft.organizationId ? null : "Select a church network.";
      case "branch":
        if (!draft.branchName.trim()) return "Enter your church or branch name.";
        if (!draft.city.trim()) return "Enter the branch city.";
        if (!draft.country.trim()) return "Enter the branch country.";
        return null;
      case "contact":
        if (!draft.pastorFirstName.trim()) return "Enter the pastor first name.";
        if (!draft.pastorLastName.trim()) return "Enter the pastor last name.";
        if (!draft.email.trim()) return "Enter a contact email.";
        return null;
      default:
        return null;
    }
  };

  const goNext = () => {
    setError(null);
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }

    if (isReviewStep) {
      void handleSubmit();
      return;
    }

    setStep(SETUP_WIZARD_STEPS[stepIndex + 1]!);
  };

  const goBack = () => {
    setError(null);
    if (isFirstStep) {
      router.back();
      return;
    }
    setStep(SETUP_WIZARD_STEPS[stepIndex - 1]!);
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    const fullName = pastorFullName(draft);

    try {
      if (session) {
        const profile = await authService.updateProfile({
          name: fullName,
          email: draft.email.trim(),
        });
        setSessionUser({ ...session.user, ...profile });
      }

      await branchService.submitBranchSetup({
        organizationId: draft.organizationId,
        branchName: draft.branchName.trim(),
        address: draft.address.trim(),
        city: draft.city.trim(),
        country: draft.country.trim(),
        pastorName: fullName,
        email: draft.email.trim(),
        phone: draft.phone.trim(),
      });

      router.replace(routes.setupBranchPending);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not submit your request.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      showBack
      backFallbackHref={routes.onboarding}
      onBackPress={goBack}
      contentClassName="justify-between"
    >
      <View className="gap-7">
        <View className="gap-2">
          <Text
            className="font-figtree-bold text-[28px] leading-[36px]"
            style={{ color: colors.text }}
          >
            Set up your church
          </Text>
          <Text
            className="font-figtree-medium text-[14px]"
            style={{ color: colors.textMuted }}
          >
            Step {setupStepNumber(step)} of {SETUP_WIZARD_STEPS.length} —{" "}
            {SETUP_STEP_LABELS[step]}
          </Text>
        </View>

        {step === "network" ? (
          <View className="gap-3">
            {SETUP_NETWORK_OPTIONS.map((option) => (
              <RoleCard
                key={option.id}
                title={option.label}
                description={option.description}
                icon={
                  option.id === "org_mfm" ? "business-outline" : "home-outline"
                }
                selected={draft.organizationId === option.id}
                onPress={() => updateDraft({ organizationId: option.id })}
              />
            ))}
          </View>
        ) : null}

        {step === "branch" ? (
          <View className="gap-4">
            <AuthField
              label="Church / Branch Name"
              placeholder="Grace Family Church"
              value={draft.branchName}
              onChangeText={(branchName) => updateDraft({ branchName })}
            />
            <AuthField
              label="Address"
              placeholder="12 Worship Avenue"
              value={draft.address}
              onChangeText={(address) => updateDraft({ address })}
            />
            <AuthField
              label="City"
              placeholder="Lagos"
              value={draft.city}
              onChangeText={(city) => updateDraft({ city })}
            />
            <AuthField
              label="Country"
              placeholder="Nigeria"
              value={draft.country}
              onChangeText={(country) => updateDraft({ country })}
            />
          </View>
        ) : null}

        {step === "contact" ? (
          <View className="gap-4">
            <AuthField
              label="First name"
              placeholder="John"
              value={draft.pastorFirstName}
              onChangeText={(pastorFirstName) => updateDraft({ pastorFirstName })}
              autoComplete="given-name"
            />
            <AuthField
              label="Last name"
              placeholder="Samuel"
              value={draft.pastorLastName}
              onChangeText={(pastorLastName) => updateDraft({ pastorLastName })}
              autoComplete="family-name"
            />
            <AuthField
              label="Email"
              placeholder="pastorjohn@gracefamily.org"
              value={draft.email}
              onChangeText={(email) => updateDraft({ email })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <AuthField
              label="Phone Number"
              placeholder="+234 801 234 5678"
              value={draft.phone}
              onChangeText={(phone) => updateDraft({ phone })}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
          </View>
        ) : null}

        {step === "review" ? (
          <View
            className="overflow-hidden rounded-2xl"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            <DetailRow
              icon="domain"
              tint={accents.purple}
              label="Network"
              subtitle={resolveOrganizationName(draft.organizationId)}
            />
            <DetailRow
              icon="church"
              tint={accents.teal}
              label="Branch"
              subtitle={draft.branchName}
            />
            <DetailRow
              icon="map-marker-outline"
              tint={accents.amber}
              label="Location"
              subtitle={[draft.address, draft.city, draft.country]
                .filter(Boolean)
                .join(", ")}
            />
            <DetailRow
              icon="account-outline"
              tint={accents.coral}
              label="Pastor"
              subtitle={pastorFullName(draft)}
            />
            <DetailRow
              icon="email-outline"
              tint={accents.purple}
              label="Contact"
              subtitle={[draft.email, draft.phone].filter(Boolean).join(" · ")}
              showDivider={false}
            />
          </View>
        ) : null}

        {error ? (
          <Text
            accessibilityRole="alert"
            className="font-figtree-medium text-[13px]"
            style={{ color: colors.error }}
          >
            {error}
          </Text>
        ) : null}

        {isReviewStep ? (
          <Text
            className="font-figtree text-[13px] leading-[19px]"
            style={{ color: colors.textMuted }}
          >
            Submitting creates a pending setup request. You will become branch
            admin after platform approval — admin tools stay locked until then.
          </Text>
        ) : null}
      </View>

      <View className="gap-3 pt-6">
        <AuthPrimaryButton
          label={
            loading
              ? "Submitting…"
              : isReviewStep
                ? "Submit for approval"
                : "Continue"
          }
          disabled={loading}
          onPress={() => goNext()}
        />
        <Pressable
          accessibilityRole="button"
          onPress={goBack}
          className="items-center py-2 active:opacity-70"
        >
          <Text
            className="font-figtree-medium text-[14px]"
            style={{ color: colors.textMuted }}
          >
            {isFirstStep ? "Back to onboarding" : "Back"}
          </Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}
