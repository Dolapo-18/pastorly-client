import AsyncStorage from "@react-native-async-storage/async-storage";

/** Shared key-value storage for mock services (session, memberships). */
export const appStorage = AsyncStorage;

export const storageKeys = {
  session: "pastorly.session",
  memberships: "pastorly.memberships",
} as const;
