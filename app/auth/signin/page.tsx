"use client";

import { useState } from "react";
import EmailEntryCard from "@/components/EmailEntryCard";
import PasswordCard from "@/components/PasswordCard";

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
    <div className="flex min-h-screen flex-col items-center justify-center">
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
  );
}
