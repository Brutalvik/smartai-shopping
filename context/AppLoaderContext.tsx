"use client";
import { createContext, useState, useContext, useEffect } from "react";

const AppLoaderContext = createContext<{
  loading: boolean;
  setLoading: (v: boolean) => void;
}>({
  loading: true,
  setLoading: () => {},
});

export const AppLoaderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10); // optional fallback timeout
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </AppLoaderContext.Provider>
  );
};

export const useAppLoader = () => useContext(AppLoaderContext);
