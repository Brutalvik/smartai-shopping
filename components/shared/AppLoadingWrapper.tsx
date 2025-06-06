"use client";

import { useAppLoader } from "@/context/AppLoaderContext";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";

export default function AppLoadingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, setLoading } = useAppLoader();
  const pathname = usePathname();

  useEffect(() => {
    // Reset loader on route change
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 10); // Adjust based on how fast pages load

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
        <XyvoLoader />
      </div>
    );
  }

  return <>{children}</>;
}
