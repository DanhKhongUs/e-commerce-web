import { createContext, useContext, ReactNode } from "react";
import { useAuthProvider } from "./useAuthProvider";

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  actions: {
    signup: (credentials: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => Promise<{ success: boolean; message?: string }>;
    signin: (credentials: {
      email: string;
      password: string;
    }) => Promise<{ success: boolean; message?: string }>;
    signout: () => Promise<string | void>;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthProvider();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
