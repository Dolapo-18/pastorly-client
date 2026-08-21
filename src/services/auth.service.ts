import type { LoginPayload, Session, SignupPayload, UserProfile } from "@/types/auth";
import type { AuthService } from "@/types/api";

const SESSION_KEY = "pastorly.mock.session";

/** In-memory session until Sprint 1 adds AsyncStorage persistence. */
let memorySession: Session | null = null;

function createMockSession(email: string, name: string): Session {
  const now = new Date().toISOString();
  return {
    token: `mock_${Date.now()}`,
    expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    user: {
      id: `user_${email.replace(/[^a-z0-9]/gi, "_")}`,
      email,
      name,
      avatarUrl: null,
      createdAt: now,
    },
  };
}

/**
 * Mock auth service — swap the implementation in `src/services/index.ts`
 * for real HTTP when the backend is ready.
 */
export const authService: AuthService = {
  async login({ email }: LoginPayload) {
    await delay(300);
    memorySession = createMockSession(email, email.split("@")[0] ?? "User");
    return memorySession;
  },

  async signup({ email, name }: SignupPayload) {
    await delay(300);
    memorySession = createMockSession(email, name);
    return memorySession;
  },

  async logout() {
    await delay(150);
    memorySession = null;
  },

  async getSession() {
    await delay(100);
    return memorySession;
  },

  async updateProfile(profile: Partial<UserProfile>) {
    await delay(200);
    if (!memorySession) {
      throw new Error("Not authenticated");
    }
    memorySession = {
      ...memorySession,
      user: { ...memorySession.user, ...profile },
    };
    return {
      name: memorySession.user.name,
      email: memorySession.user.email,
      avatarUrl: memorySession.user.avatarUrl,
    };
  },
};

/** Dev helper — inspect or reset mock session without going through UI. */
export const authServiceDev = {
  sessionKey: SESSION_KEY,
  getMemorySession: () => memorySession,
  setMemorySession: (session: Session | null) => {
    memorySession = session;
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
