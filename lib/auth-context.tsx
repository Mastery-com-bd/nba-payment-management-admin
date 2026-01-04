"use client";

import { authApi } from "@/lib/api/authApi";
import type { User, UserRole } from "@/lib/types";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; error?: string; email?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.getMe();
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      if (response.success) {
        const userResponse = await authApi.getMe();
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
        }
        return { success: true };
      }
      return { success: false, error: response.message || "Login failed" };
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await authApi.register({
        email: data.email,
        full_name: data.fullName,
        password: data.password,
        role: data.role || "user",
      });
      if (response.success) {
        return { success: true, email: data.email };
      }
      return {
        success: false,
        error: response.message || "Registration failed",
      };
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
  }, []);

  const updateUser = useCallback(
    (data: Partial<User>) => {
      if (user) {
        setUser({ ...user, ...data });
      }
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
