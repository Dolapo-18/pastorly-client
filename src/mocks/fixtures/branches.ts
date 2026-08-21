import type { Branch } from "@/types/branch";

export const MFM_ORGANIZATION = {
  id: "org_mfm",
  name: "Mountain of Fire and Miracles Ministries",
  slug: "mfm",
} as const;

/** Branch catalogue — Sprint 2 will load these from the API. */
export const MOCK_BRANCH_CATALOG: Branch[] = [
  {
    id: "branch_mfm_ikeja",
    organizationId: "org_mfm",
    name: "MFM Ikeja",
    slug: "mfm-ikeja",
    city: "Lagos",
    country: "Nigeria",
    joinPolicy: "approval_required",
  },
  {
    id: "branch_mfm_abuja",
    organizationId: "org_mfm",
    name: "MFM Abuja",
    slug: "mfm-abuja",
    city: "Abuja",
    country: "Nigeria",
    joinPolicy: "open",
  },
  {
    id: "branch_grace_family",
    organizationId: "org_independent",
    name: "Grace Family Church",
    slug: "grace-family",
    city: "Lagos",
    country: "Nigeria",
    joinPolicy: "invite_only",
  },
];

export const INVITE_CODES: Record<string, string> = {
  "GRACE-2024": "branch_grace_family",
  "MFM-IKEJA": "branch_mfm_ikeja",
  "MFM-ABUJA": "branch_mfm_abuja",
};

/** Demo account with existing branch memberships after sign-in. */
export const DEMO_USER_EMAIL = "pastor@mfm.org";