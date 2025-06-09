// pages/auth/seller-register.tsx
"use client";

import { Image } from "@heroui/react";
import SellerRegistrationCard from "@/components/seller/SellerRegistrationCard";

export default function SellerRegisterPage() {
  return (
    <div
      className={
        "min-h-[90%] flex flex-col lg:flex-row transition-opacity duration-500"
      }
    >
      <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center">
        <Image src="/xbagsecure.png" alt="shopping bag" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <SellerRegistrationCard />
      </div>
    </div>
  );
}
