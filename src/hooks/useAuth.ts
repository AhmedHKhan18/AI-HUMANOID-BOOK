import { useContext } from "react";
import { useSession, signIn, signUp, signOut } from "@site/src/lib/auth-client";

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  username?: string;
  name?: string | null;
  image?: string | null;
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  signIn: typeof signIn;
  signUp: typeof signUp;
  signOut: typeof signOut;
}

export function useAuth(): UseAuthReturn {
  const { data, isPending } = useSession();

  return {
    user: data?.user as User | null,
    isLoading: isPending,
    isAuthenticated: !!data?.user,
    isEmailVerified: data?.user?.emailVerified ?? false,
    signIn,
    signUp,
    signOut,
  };
}

export default useAuth;
