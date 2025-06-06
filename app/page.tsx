"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SplashScreen from "@/components/ui/XSplashScreen/XSplashScreen";
import dynamic from "next/dynamic";

// Lazy-load HeroSection with fallback only after splash screen
const HeroSection = dynamic(() => import("@/components/HeroSection"), {
  loading: () => <SplashScreen />, // only used after splash
});

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  // 🍞 Display toast messages
  useEffect(() => {
    const toastMsg = localStorage.getItem("toastMessage");
    const signInMsg = localStorage.getItem("successfulSignin");

    if (toastMsg) {
      toast.success(toastMsg);
      localStorage.removeItem("toastMessage");
    }

    if (signInMsg) {
      toast.success(signInMsg);
      localStorage.removeItem("successfulSignin");
    }
  }, []);

  // ⏱ Simulated splash only on first load
  // useEffect(() => {
  //   const timer = setTimeout(() => setShowSplash(false), 1500);
  //   return () => clearTimeout(timer);
  // }, []);

  // // 🧼 Splash during app intro
  // if (showSplash) {
  //   return <SplashScreen />;
  // }

  // Main Page with lazy-loaded HeroSection
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-4">
      <div className="mt-2">
        <HeroSection />
      </div>
    </section>
  );
}
