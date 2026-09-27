import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LawyerProfile } from "../types.ts";
import { api, getStoredToken, setStoredToken, removeStoredToken } from "../services/api.ts";

interface AuthContextType {
  user: (User & { lawyerProfile?: LawyerProfile }) | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (role: "client" | "lawyer" | "admin") => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & { lawyerProfile?: LawyerProfile }) | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      if (!getStoredToken()) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.token) {
        setStoredToken(res.token);
        setToken(res.token);
        await refreshUser();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(payload);
      if (res.success && res.token) {
        setStoredToken(res.token);
        setToken(res.token);
        await refreshUser();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeStoredToken();
    setToken(null);
    setUser(null);
  };

  const quickDemoLogin = async (role: "client" | "lawyer" | "admin") => {
    if (role === "client") {
      await login("sarah@demo.legalconnect.com", "password123");
    } else if (role === "lawyer") {
      await login("marcus.vance@demo.legalconnect.com", "lawyer123");
    } else if (role === "admin") {
      await login("admin@legalconnect.com", "admin123");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        quickDemoLogin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
