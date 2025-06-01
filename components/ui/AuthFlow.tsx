// components/ui/AuthFlow.tsx
"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AuthCard from "@/components/ui/AuthCard";
import PasswordCard from "@/components/ui/PasswordCard";

export default function AuthFlow() {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("password");
  };

  const handlePasswordSubmit = (password: string) => {
    console.log("Login complete for", email);
    // TODO: route to dashboard or trigger auth logic
  };

  const handleBackToEmail = () => {
    setStep("email");
    setEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <AnimatePresence mode="wait">
        {step === "email" && (
          <AuthCard key="email" onEmailSubmit={handleEmailSubmit} />
        )}

        {step === "password" && (
          <PasswordCard
            key="password"
            email={email}
            onPasswordSubmit={handlePasswordSubmit}
            onBack={handleBackToEmail}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
