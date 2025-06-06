"use client";
import HeroSection from "@/components/HeroSection";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Home() {
  useEffect(() => {
    const message = localStorage.getItem("toastMessage");
    if (message) {
      toast.success(message);
      localStorage.removeItem("toastMessage");
    }
  }, []);

  useEffect(() => {
    const message = localStorage.getItem("successfulSignin");
    if (message) {
      toast.success(message);
      localStorage.removeItem("successfulSignin");
    }
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-4">
      <div className="mt-2">
        <HeroSection />
      </div>
    </section>
  );
}
