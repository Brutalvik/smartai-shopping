"use client";

import { useState } from "react";
import EmailEntryCard from "@/components/EmailEntryCard";
import PasswordCard from "@/components/PasswordCard";
import { Image } from "@heroui/react";

interface AccountInfo {
  type: "Customer" | "Seller";
  poolId: string;
}

export default function AuthPage() {
  const [currentStep, setCurrentStep] = useState<"email" | "password">("email");
  const [emailForLogin, setEmailForLogin] = useState<string>("");
  const [userPoolIdForLogin, setUserPoolIdForLogin] = useState<string>("");
  const [accountTypeForLogin, setAccountTypeForLogin] = useState<
    "Customer" | "Seller"
  >("Customer");

  const handleUserExists = (email: string, accountInfo: AccountInfo) => {
    setEmailForLogin(email);
    setUserPoolIdForLogin(accountInfo.poolId);
    setAccountTypeForLogin(accountInfo.type);
    setCurrentStep("password");
  };

  const handleGoBack = () => {
    setCurrentStep("email");
    setEmailForLogin("");
    setUserPoolIdForLogin("");
    setAccountTypeForLogin("Customer");
  };

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
        {currentStep === "email" && (
          <EmailEntryCard onUserExists={handleUserExists} />
        )}

        {currentStep === "password" && (
          <PasswordCard
            email={emailForLogin}
            userPoolId={userPoolIdForLogin}
            accountType={accountTypeForLogin}
            onBack={handleGoBack}
          />
        )}
      </div>
    </div>
  );
}
