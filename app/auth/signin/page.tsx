"use client";

import { useState } from "react";
import EmailEntryCard from "@/components/EmailEntryCard";
import PasswordCard from "@/components/PasswordCard";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[90%] flex flex-col lg:flex-row mt-[5%]">
      {/* Left side - only visible on large screens and up */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-gray-100 items-center justify-center">
        <div className="text-center text-gray-500 text-xl">[Left Content]</div>
      </div>

      {/* Right side - always visible */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
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
    </div>
  );
}
