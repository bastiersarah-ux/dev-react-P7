"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@front/types/auth";
import { fetchAPI } from "@front/services/api";

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const TOKEN_KEY = "abricot_token";

  const fetchUser = async (jwt: string) => {
    try {
      setIsLoading(true);
      const res = await fetchAPI("/auth/profile", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!res.ok) throw new Error("Token invalide");
      const data: User = await res.json();
      setUser(data);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (jwt: string, userData: User) => {
    localStorage.setItem(TOKEN_KEY, jwt);
    setToken(jwt);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error(
      "useAuth doit être utilisé à l’intérieur d’un AuthProvider.",
    );
  return context;
};
