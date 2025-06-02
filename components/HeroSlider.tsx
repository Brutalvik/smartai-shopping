// components/HeroWithSearch.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Truck, BadgePercent, ArrowRight } from "lucide-react";
import { Select, SelectItem } from "@heroui/select";
import Image from "next/image";

const featuredSlides = [
  {
    image: "/iphone.png",
    deal: "Up to 25% off today",
    text: "Meet the new iPhone 16 Pro Max – blazing speed, iconic design, and exclusive launch deals you won't want to miss.",
    cta: "Explore iPhone deals",
  },
  {
    image: "/macbook.png",
    deal: "Up to 20% off today",
    text: "Introducing the MacBook Pro M4 Series – power, performance, and portability all in one beautiful machine.",
    cta: "Shop MacBooks",
  },
  {
    image: "/robot.png",
    deal: "Smart Savings Today",
    text: "Let your floors clean themselves – explore cutting-edge smart vacuum robots with effortless automation.",
    cta: "Discover Smart Robots",
  },
  {
    image: "/tv.png",
    deal: "Spectacular Screen Deals",
    text: "Enjoy your favorite shows in stunning clarity – top 2025 TVs from Samsung, LG, Sony & more.",
    cta: "Browse TV Offers",
  },
];

export default function HeroWithSearch() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % featuredSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const current = featuredSlides[index];

  return (
    <section className="w-full bg-background py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Section */}
        <div>
          <motion.h1
            className="text-4xl md:text-5xl font-bold leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Don’t miss out on exclusive deals made for you.
          </motion.h1>

          <div className="flex items-center gap-2 text-default-500 mb-6">
            <Truck className="w-5 h-5" />
            <p className="text-sm md:text-base">
              Free delivery for orders over $200
            </p>
          </div>

          {/* Search bar */}
          <div className="flex w-full rounded-xl overflow-hidden border border-default-200">
            <Select
              aria-label="Category"
              className="w-[30%] min-w-fit border-r border-default-200"
            >
              <SelectItem key="all">All Categories</SelectItem>
              <SelectItem key="electronics">Electronics</SelectItem>
              <SelectItem key="fashion">Fashion</SelectItem>
              <SelectItem key="gaming">Gaming</SelectItem>
            </Select>
            <Input
              placeholder="Search entire store here"
              className="w-[65%] border-none focus:ring-0 rounded-none"
            />
            <Button className="w-[5%] rounded-none" isIconOnly variant="light">
              🔍
            </Button>
          </div>

          {/* Divider */}
          <hr className="my-6 border-default-200" />

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 text-primary">
                💸{" "}
                <span className="font-semibold text-default-800">
                  Moneyback
                </span>
              </div>
              <p className="text-default-500 text-sm">
                Did you change your mind? You can return the product within 14
                days.
              </p>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 text-primary">
                🏷️{" "}
                <span className="font-semibold text-default-800">
                  Weekly Promotions
                </span>
              </div>
              <p className="text-default-500 text-sm">
                Explore our exclusive weekly promotions for special discounts.
              </p>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-white/5 dark:bg-zinc-900 rounded-xl overflow-hidden p-0 shadow-lg flex flex-col justify-between h-[420px]">
          <div className="relative h-[80%] w-full">
            <Image
              src={current.image}
              alt="Featured"
              layout="fill"
              objectFit="cover"
              className="rounded-t-xl"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`slide-content-${index}`}
              className="p-4 space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 text-xs bg-default-200 text-default-800 px-2 py-1 rounded-full w-fit">
                <BadgePercent className="w-3 h-3" />
                {current.deal}
              </div>
              <p className="text-sm font-medium text-default-800 dark:text-white">
                {current.text}
              </p>
              <button className="text-primary text-sm font-medium inline-flex items-center gap-1">
                {current.cta} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
