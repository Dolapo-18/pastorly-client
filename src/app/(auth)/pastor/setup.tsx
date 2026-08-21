import { Redirect } from "expo-router";

export default function LegacyPastorSetupRedirect() {
  return <Redirect href="/(app)/onboarding/setup-branch" />;
}
