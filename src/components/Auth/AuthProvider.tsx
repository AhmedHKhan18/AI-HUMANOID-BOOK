import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "@site/src/lib/auth-client";

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  username?: string;
  name?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  isEmailVerified: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const { data, isPending } = useSession();

  const value: AuthContextType = {
    user: data?.user as User | null,
    session: data?.session as Session | null,
    isLoading: isPending,
    isAuthenticated: !!data?.user,
    isEmailVerified: data?.user?.emailVerified ?? false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthProvider;
