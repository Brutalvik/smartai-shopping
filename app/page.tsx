"use client";
import HeroSection from "@/components/HeroSection";
import { useEffect } from "react";
import { addToast } from "@heroui/react";
import SubNavbar from "@/components/SubNavbar";
import Banner from "@/components/Banner/Banner";
import ProductScroller from "@/components/ProductsScroller";

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

  const featuredProducts = [
    {
      id: 1,
      name: "AirPods Pro",
      price: "$199.00",
      image: "/products/airpods.png",
    },
    {
      id: 2,
      name: "MacBook Pro",
      price: "$1899.00",
      image: "/products/mcbook.png",
    },
    {
      id: 3,
      name: "LG TV",
      price: "$1599.50",
      image: "/products/lg.png",
    },
    {
      id: 4,
      name: "Xbox",
      price: "$499.98",
      image: "/products/xboxsmall.png",
    },
    {
      id: 5,
      name: "Hoodie",
      price: "$19.50",
      image: "/products/hoodie.png",
    },
    {
      id: 6,
      name: "Chair",
      price: "$199",
      image: "/products/chair.png",
    },
    {
      id: 7,
      name: "Chair",
      price: "$145",
      image: "/products/computechair.png",
    },
    {
      id: 8,
      name: "Bundle",
      price: "$244.44",
      image: "/products/bundle.png",
    },
  ];

  return (
    <div className="w-full">
      <SubNavbar />
      <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-4">
        <Banner />
        <ProductScroller products={featuredProducts} className="mt-10" />
        <HeroSection />
      </section>
    </div>
  );
}
