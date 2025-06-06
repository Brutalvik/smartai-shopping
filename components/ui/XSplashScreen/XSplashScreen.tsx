"use client";

import { useEffect, useState } from "react";
import XLoader from "@/components/ui/XLoader/XLoader";
export default function SplashScreen({
  duration = 3000, // duration in ms
  onFinish,
}: {
  duration?: number;
  onFinish?: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700">
      <XLoader />
    </div>
  );
}
