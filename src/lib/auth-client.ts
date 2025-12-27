import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Client-side: use environment variable or default
    return process.env.NODE_ENV === "production"
      ? "https://api.yourdomain.com" // Update for production
      : "http://localhost:3001";
  }
  // Server-side during build
  return "http://localhost:3001";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signUp, signOut, useSession } = authClient;
