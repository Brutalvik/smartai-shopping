"use client";

import { useState } from "react";
import EmailEntryCard from "@/components/EmailEntryCard";
import PasswordCard from "@/components/PasswordCard";
import { Image } from "@heroui/react";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[90%] flex flex-col lg:flex-row">
      {/* Left side - only visible on large screens and up */}
      <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center">
        <Image src="/xbagsecure.png" alt="shopping bag" />
      </div>

      {/* Right side - always visible */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        {showPassword ? (
          <PasswordCard email={email} onBack={() => setShowPassword(false)} />
        ) : (
          <EmailEntryCard
            onUserExists={(enteredEmail: string) => {
              setEmail(enteredEmail);
              setShowPassword(true);
            }}
          />
        )}
      </div>
    </div>
  );
}
