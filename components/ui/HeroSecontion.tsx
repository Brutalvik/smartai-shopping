// components/ui/HeroSection.tsx
"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { SearchIcon } from "@/components/icons";

export default function HeroSection() {
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      labelPlacement="outside"
      placeholder="Search for products, categories, or brands"
      type="search"
    />
  );

  return (
    <section className="w-full max-w-5xl mx-auto px-4 pt-16 pb-24 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
        Welcome to XYVO
      </h1>
      <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
        Shop smarter with personalized AI-powered recommendations.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="w-full sm:w-[400px]">{searchInput}</div>
        <Button
          variant="solid"
          color="primary"
          className="w-full sm:w-auto"
          startContent={<SearchIcon />}
        >
          Search
        </Button>
      </div>

      <p className="mt-6 text-sm text-default-500">
        Try searching for "smartphones", "kitchen appliances", or "backpacks"
      </p>
    </section>
  );
}
