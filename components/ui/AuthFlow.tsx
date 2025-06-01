// components/ui/AuthFlow.tsx
"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AuthCard from "@/components/ui/AuthCard";
import PasswordCard from "@/components/ui/PasswordCard";
import RegisterCard from "@/components/ui/RegisterCArd";

export default function AuthFlow() {
  const [step, setStep] = useState<"email" | "password" | "register">("email");
  const [email, setEmail] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const handleEmailSubmit = async (submittedEmail: string) => {
    setEmail(submittedEmail);
    const exists = await mockCheckUserExists(submittedEmail);
    setIsNewUser(!exists);
    setStep(exists ? "password" : "register");
  };

  const handlePasswordSubmit = (password: string) => {
    console.log("✅ Login complete for", email);
  };

  const handleRegisterSubmit = (data: { name: string; password: string }) => {
    console.log("✅ Registration complete for", email, "→", data);
  };

  const handleBackToEmail = () => {
    setStep("email");
    setEmail("");
    setIsNewUser(false);
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

        {step === "register" && (
          <RegisterCard
            key="register"
            email={email}
            onRegisterSubmit={handleRegisterSubmit}
            onBack={handleBackToEmail}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Temporary mock logic
async function mockCheckUserExists(email: string): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 800));
  return email.toLowerCase().endsWith("@xyvo.ai");
}
