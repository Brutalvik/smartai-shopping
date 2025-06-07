"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("redirect") || "/";
    // Hard reload to trigger middleware
    window.location.href = target;
  }, []);

  return null;
}
