"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@front/types/api-types";
import { fetchAPI } from "@front/services/fetch-api";

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const res = await fetchAPI<{ user: User }>("/auth/profile");
      if (res?.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Erreur de récupération du profil:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setUser(null);
      router.push("/auth/login");
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, isLoading }}
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
