import { useEffect, useRef, useState } from "react";
import * as authAPI from "../../services/authService";
import { toast } from "react-toastify";

// ==== Interfaces ====
interface APIResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface Credentials {
  email: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
}

// ==== Hook useAuthProvider ===
export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const justSignedOut = useRef(false);

  useEffect(() => {
    if (justSignedOut.current) {
      justSignedOut.current = false;
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    const fetchAuth = async () => {
      try {
        setIsLoading(true);
        const res = await authAPI.checkAuth();
        if (res.success && res.data) {
          setUser(res.data);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuth();
  }, []);

  const signup = async (credentials: Credentials) => {
    try {
      const data: APIResponse<User> = await authAPI.signup(credentials);
      if (!data.success) {
        toast.error(data.message || "Signup failed.");
        return { success: false, message: data.message || "Signup failed." };
      }

      toast.success("SignUp successful. Please signin");
      return { success: true };
    } catch (error) {
      console.error("SignUp error:", error);
      toast.error("Signup failed. Please try again.");
      return { success: false, message: "Signup failed. Please try again." };
    }
  };

  const signin = async (credentials: Credentials) => {
    try {
      const data: APIResponse<User> = await authAPI.signin(credentials);

      if (!data.success) {
        toast.error(data.message || "Signin failed.");
        return { success: false, message: data.message || "Signin failed." };
      }

      setUser(data.data || null);
      setIsAuthenticated(true);
      toast.success("SignIn successful");
      return { success: true };
    } catch (error) {
      console.error("SignIn error:", error);
      toast.error("Signin failed. Please try again.");
      return { success: false, message: "Signin failed. Please try again." };
    }
  };

  const signout = async () => {
    try {
      const data: APIResponse<User> = await authAPI.signout();

      if (!data.success) {
        toast.error(data.message || "Signout failed.");
        return data.message;
      }

      justSignedOut.current = true; // Đánh giấu vừa signout
      setIsAuthenticated(false);
      setUser(null);
      toast.success("SignOut successful");
    } catch (error) {
      console.error("SignOut error:", error);
      toast.error("Signout failed. Please try again.");
      return "Signout failed.";
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    actions: {
      signup,
      signin,
      signout,
    },
  };
};
