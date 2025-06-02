// components/ui/HeroSection.tsx
"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { SearchIcon } from "@/components/icons";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";

export default function HeroSection() {
  return (
    <>
      <HeroSlider />
      <CategoryGrid />
    </>
  );
}
