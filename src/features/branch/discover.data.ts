export const DISCOVER_NETWORK_FILTERS = ["All", "MFM", "Independent"] as const;

export type DiscoverNetworkFilter = (typeof DISCOVER_NETWORK_FILTERS)[number];

export function organizationIdForFilter(
  filter: DiscoverNetworkFilter,
): string | undefined {
  switch (filter) {
    case "MFM":
      return "org_mfm";
    case "Independent":
      return "org_independent";
    default:
      return undefined;
  }
}
