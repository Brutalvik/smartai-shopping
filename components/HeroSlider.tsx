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
    text: "Meet the new iPhone 16 Pro Max – blazing speed, iconic design, and exclusive launch deals you wont want to miss.",
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
  {
    image: "/xbox.png",
    deal: "Up to 30% Off Gaming Gear",
    text: "Level up your play with deals on consoles, games, and accessories from top brands like PlayStation, Xbox & Razer.",
    cta: "See Gaming Deals",
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
    <section className="relative w-full bg-background py-12 md:py-16 perspective-[2000px]">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: -10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center"
      >
        {/* Right Card */}
        <div className="order-1 lg:order-2 transform-style-3d w-full">
          <div className="bg-white/5 dark:bg-zinc-900 rounded-2xl shadow-lg h-full flex flex-col justify-between">
            <div className="relative w-full overflow-hidden h-48 sm:h-64 md:h-72 lg:h-80">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`image-${index}`}
                  className="absolute inset-0 w-full h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                >
                  <Image
                    src={current.image}
                    alt="Banner"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`slide-content-${index}`}
                className="p-4 sm:p-6 space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 text-xs bg-default-200 text-default-800 px-2 py-1 rounded-full w-fit">
                  <BadgePercent className="w-3 h-3" />
                  {current.deal}
                </div>
                <p className="text-sm sm:text-base font-medium text-default-800 dark:text-white">
                  {current.text}
                </p>
                <button className="text-primary text-sm font-medium inline-flex items-center gap-1">
                  {current.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Left Content */}
        <div className="order-2 lg:order-1 transform-style-3d w-full">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Don’t miss out on exclusive deals made for you.
          </motion.h1>

          <motion.div
            className="flex items-center gap-2 text-default-500 mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Truck className="w-5 h-5" />
            <p className="text-sm sm:text-base">
              Free delivery for orders over $200
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="flex flex-wrap sm:flex-nowrap w-full rounded-xl overflow-hidden border border-default-200"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Select
              aria-label="Category"
              className="basis-full sm:basis-[30%] border-r border-default-200 min-w-[120px]"
            >
              <SelectItem key="all">All Categories</SelectItem>
              <SelectItem key="electronics">Electronics</SelectItem>
              <SelectItem key="fashion">Fashion</SelectItem>
              <SelectItem key="gaming">Gaming</SelectItem>
            </Select>
            <Input
              placeholder="Search entire store here"
              className="flex-grow border-none focus:ring-0 rounded-none min-w-[150px]"
            />
            <Button
              className="px-3 sm:px-4 py-3 sm:py-0 rounded-none"
              isIconOnly
              variant="light"
            >
              🔍
            </Button>
          </motion.div>

          <hr className="my-6 border-default-200" />

          <motion.div
            className="flex flex-col md:flex-row gap-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 text-primary">
                💸{" "}
                <span className="font-semibold text-default-800">
                  Moneyback
                </span>
              </div>
              <p className="text-default-500 text-sm sm:text-base">
                Changed your mind? Return the product within 14 days.
              </p>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 text-primary">
                🏷️{" "}
                <span className="font-semibold text-default-800">
                  Weekly Promotions
                </span>
              </div>
              <p className="text-default-500 text-sm sm:text-base">
                Discover exclusive discounts every week.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
