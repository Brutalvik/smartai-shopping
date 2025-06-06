"use client";
import RegisterCard from "@/components/RegisterCard";
import { Image } from "@heroui/react";

export default function RegisterPage() {
  return (
    <div className="min-h-[90%] flex flex-col lg:flex-row">
      {/* Left side - only visible on large screens and up */}
      <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center">
        <Image src="/xbagsecure.png" alt="shopping bag" />
      </div>

      {/* Right side - always visible */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <RegisterCard />
      </div>
    </div>
  );
}
