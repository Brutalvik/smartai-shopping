"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const ndaAccepted = localStorage.getItem("ndaVerified");

    if (ndaAccepted === "true" || pathname === "/nda") {
      setIsAllowed(true);
    } else {
      router.push("/nda");
    }
  }, [pathname]);

  if (!isAllowed) return null;

  return <>{children}</>;
}
