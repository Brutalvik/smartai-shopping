"use client";

import { Image } from "@heroui/react";
import RegisterCard from "@/components/RegisterCard";

export default function RegisterPage() {
  return (
    <div
      className={
        "min-h-[90%] flex flex-col lg:flex-row transition-opacity duration-500"
      }
    >
      {/* Left image side */}
      <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center">
        <Image src="/xbagsecure.png" alt="shopping bag" />
      </div>

      {/* Right register form side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <RegisterCard />
      </div>
    </div>
  );
}
