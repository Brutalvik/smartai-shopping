"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { CDN } from "@/config/config";

export interface User {
  [key: string]: any;
  id: string;
  email: string;
  name?: string;
  group?: string;
  phone?: string;
  business_name?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${CDN.userAuthApi}/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const user = await res.json();
          setUser(user);
        }
      } catch (err) {
        console.warn("Could not fetch user:", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a <UserProvider>");
  }
  return context;
};
