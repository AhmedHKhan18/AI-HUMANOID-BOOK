import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useSession, getStoredAuth } from "@site/src/lib/auth-client";

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
  const [localAuth, setLocalAuth] = useState<{ user: User } | null>(null);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.user) {
      setLocalAuth({ user: stored.user as User });
    }
    setIsLocalLoading(false);
  }, []);

  // Use server session if available, otherwise fall back to localStorage
  const user = (data?.user as User | null) || localAuth?.user || null;
  const isLoading = isPending && isLocalLoading;

  const value: AuthContextType = {
    user,
    session: data?.session as Session | null,
    isLoading,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified ?? false,
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
