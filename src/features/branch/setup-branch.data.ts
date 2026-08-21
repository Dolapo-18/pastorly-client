import { MFM_ORGANIZATION } from "@/mocks/fixtures/branches";

export const SETUP_WIZARD_STEPS = [
  "network",
  "branch",
  "contact",
  "review",
] as const;

export type SetupWizardStep = (typeof SETUP_WIZARD_STEPS)[number];

export type SetupNetworkOption = {
  id: string;
  label: string;
  description: string;
};

export const SETUP_NETWORK_OPTIONS: SetupNetworkOption[] = [
  {
    id: MFM_ORGANIZATION.id,
    label: "MFM",
    description: "Mountain of Fire and Miracles Ministries network",
  },
  {
    id: "org_independent",
    label: "Independent church",
    description: "Register a standalone church or new network",
  },
];

export type BranchSetupDraft = {
  organizationId: string;
  branchName: string;
  address: string;
  city: string;
  country: string;
  pastorFirstName: string;
  pastorLastName: string;
  email: string;
  phone: string;
};

export function pastorFullName(draft: Pick<BranchSetupDraft, "pastorFirstName" | "pastorLastName">) {
  return [draft.pastorFirstName, draft.pastorLastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

export function splitPastorName(fullName?: string) {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? [];
  return {
    pastorFirstName: parts[0] ?? "",
    pastorLastName: parts.slice(1).join(" "),
  };
}

export const SETUP_STEP_LABELS: Record<SetupWizardStep, string> = {
  network: "Network",
  branch: "Branch details",
  contact: "Pastor contact",
  review: "Review & submit",
};

export function setupStepNumber(step: SetupWizardStep): number {
  return SETUP_WIZARD_STEPS.indexOf(step) + 1;
}
