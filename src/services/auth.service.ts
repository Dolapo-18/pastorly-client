import type {
  ForgotPasswordPayload,
  LoginPayload,
  Session,
  SignupPayload,
  UserProfile,
} from "@/types/auth";
import type { AuthService } from "@/types/api";
import { appStorage, storageKeys } from "@/lib/storage";

function createMockSession(email: string, name: string): Session {
  const now = new Date().toISOString();
  return {
    token: `mock_${Date.now()}`,
    expiresAt: new Date(Date.now() + 86_400_000 * 7).toISOString(),
    user: {
      id: `user_${email.replace(/[^a-z0-9]/gi, "_").toLowerCase()}`,
      email: email.trim().toLowerCase(),
      name,
      avatarUrl: null,
      createdAt: now,
    },
  };
}

async function readSession(): Promise<Session | null> {
  const raw = await appStorage.getItem(storageKeys.session);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as Session;
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      await appStorage.removeItem(storageKeys.session);
      return null;
    }
    return session;
  } catch {
    await appStorage.removeItem(storageKeys.session);
    return null;
  }
}

async function writeSession(session: Session | null) {
  if (!session) {
    await appStorage.removeItem(storageKeys.session);
    return;
  }
  await appStorage.setItem(storageKeys.session, JSON.stringify(session));
}

export const authService: AuthService = {
  async login({ email, password }: LoginPayload) {
    await delay(300);
    if (!email.trim() || !password.trim()) {
      throw new Error("Invalid credentials");
    }
    const session = createMockSession(email, email.split("@")[0] ?? "User");
    await writeSession(session);
    return session;
  },

  async signup({ email, name, password }: SignupPayload) {
    await delay(300);
    if (!email.trim() || !name.trim() || !password.trim()) {
      throw new Error("Invalid signup payload");
    }
    const session = createMockSession(email, name.trim());
    await writeSession(session);
    return session;
  },

  async logout() {
    await delay(150);
    await writeSession(null);
  },

  async getSession() {
    await delay(80);
    return readSession();
  },

  async updateProfile(profile: Partial<UserProfile>) {
    await delay(200);
    const session = await readSession();
    if (!session) {
      throw new Error("Not authenticated");
    }
    const next: Session = {
      ...session,
      user: { ...session.user, ...profile },
    };
    await writeSession(next);
    return {
      name: next.user.name,
      email: next.user.email,
      avatarUrl: next.user.avatarUrl,
    };
  },

  async requestPasswordReset({ email }: ForgotPasswordPayload) {
    await delay(400);
    if (!email.trim()) {
      throw new Error("Email is required");
    }
    // Mock always succeeds — Sprint 1 UI only.
  },
};

export const authServiceDev = {
  sessionKey: storageKeys.session,
  clearSession: () => writeSession(null),
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
