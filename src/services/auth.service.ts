import type {
  LoginPayload,
  ResetPasswordWithOtpPayload,
  SendPasswordOtpPayload,
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

  async sendPasswordOtp({ email }: SendPasswordOtpPayload) {
    await delay(400);
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error("Email is required");
    }

    const otp = "123456";
    const pending = await readPendingOtps();
    pending[normalizedEmail] = {
      otp,
      expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
    };
    await writePendingOtps(pending);
  },

  async resetPasswordWithOtp({
    email,
    otp,
    password,
  }: ResetPasswordWithOtpPayload) {
    await delay(400);
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !otp.trim() || !password.trim()) {
      throw new Error("All fields are required");
    }

    const pending = await readPendingOtps();
    const entry = pending[normalizedEmail];
    if (!entry) {
      throw new Error("No code found for this email. Request a new one.");
    }
    if (new Date(entry.expiresAt).getTime() <= Date.now()) {
      delete pending[normalizedEmail];
      await writePendingOtps(pending);
      throw new Error("Code expired. Request a new one.");
    }
    if (entry.otp !== otp.trim()) {
      throw new Error("Invalid code. Check and try again.");
    }

    delete pending[normalizedEmail];
    await writePendingOtps(pending);
  },
};

export const authServiceDev = {
  sessionKey: storageKeys.session,
  clearSession: () => writeSession(null),
  mockOtp: "123456",
};

type PendingOtpEntry = {
  otp: string;
  expiresAt: string;
};

async function readPendingOtps(): Promise<Record<string, PendingOtpEntry>> {
  const raw = await appStorage.getItem(storageKeys.passwordResetOtp);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, PendingOtpEntry>;
  } catch {
    return {};
  }
}

async function writePendingOtps(entries: Record<string, PendingOtpEntry>) {
  if (Object.keys(entries).length === 0) {
    await appStorage.removeItem(storageKeys.passwordResetOtp);
    return;
  }
  await appStorage.setItem(storageKeys.passwordResetOtp, JSON.stringify(entries));
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
