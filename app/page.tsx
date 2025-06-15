"use client";
import HeroSection from "@/components/HeroSection";
import { useEffect } from "react";
import { addToast } from "@heroui/react";
import SubNavbar from "@/components/SubNavbar";
import Banner from "@/components/Banner/Banner";
import ProductScroller from "@/components/ProductsScroller";
import { featuredProducts } from "@/data/dummyData";

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
    <div className="w-full">
      <div className="w-full px-2">
        <SubNavbar />
      </div>
      <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-4">
        <Banner />
      </section>
      <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-4">
        <ProductScroller products={featuredProducts} className="mt-10" />
      </section>
      <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-4">
        <HeroSection />
      </section>
    </div>
  );
}
