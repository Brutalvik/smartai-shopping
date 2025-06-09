"use client";
import HeroSection from "@/components/HeroSection";
import { useEffect } from "react";
import { addToast } from "@heroui/react";
import SubNavbar from "@/components/SubNavbar";

export default function Home() {
  useEffect(() => {
    const message = localStorage.getItem("accountCreated");
    if (message) {
      addToast({
        description: message,
        color: "success",
        timeout: 1500,
      });
      localStorage.removeItem("accountCreated");
    }
  }, []);

  useEffect(() => {
    const message = localStorage.getItem("successfulSignin");
    if (message) {
      addToast({
        description: message,
        color: "primary",
        timeout: 1500,
      });
      localStorage.removeItem("successfulSignin");
    }
  }, []);

  return (
    <>
      <SubNavbar />
      <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-4">
        <HeroSection />
      </section>
    </>
  );
}
