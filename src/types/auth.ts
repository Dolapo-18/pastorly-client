/** Global user identity — not scoped to a branch. */

export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  createdAt: string;
};

export type Session = {
  token: string;
  user: User;
  expiresAt: string;
};

export type UserProfile = Pick<User, "name" | "email" | "avatarUrl">;

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  password: string;
  name: string;
};

export type AuthError = {
  code: string;
  message: string;
};
