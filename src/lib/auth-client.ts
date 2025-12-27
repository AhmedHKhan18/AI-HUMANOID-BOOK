import { createAuthClient } from "better-auth/react";

const API_URL = typeof window !== "undefined" && process.env.NODE_ENV === "production"
  ? "https://ai-humanoid-book-production.up.railway.app"
  : "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: API_URL,
  fetchOptions: {
    credentials: "include",
  },
});

// Storage keys
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

// Helper to store auth data locally
export const storeAuthData = (token: string, user: unknown) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

// Helper to get stored auth data
export const getStoredAuth = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  if (token && userStr) {
    try {
      return { token, user: JSON.parse(userStr) };
    } catch {
      return null;
    }
  }
  return null;
};

// Helper to clear auth data
export const clearAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

export const { signIn, signUp, signOut, useSession } = authClient;
