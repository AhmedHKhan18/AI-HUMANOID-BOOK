export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  username: string;
  name: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: AuthSession | null;
}

export interface SessionResponse {
  session: AuthSession | null;
  user: AuthUser | null;
}

export interface AuthError {
  code: string;
  message: string;
  retryAfter?: number;
}

export type SignUpInput = {
  email: string;
  password: string;
  username: string;
  name?: string;
};

export type SignInInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type PasswordResetInput = {
  token: string;
  password: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type UpdateProfileInput = {
  username?: string;
  name?: string;
  image?: string;
};
