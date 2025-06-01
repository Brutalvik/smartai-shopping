// components/auth/AuthFlow.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RegisterCard from "@/components/ui/RegisterCard";
import EmailEntryCard from "@/components/ui/EmailEntryCard";

export default function AuthFlow() {
  const [step, setStep] = useState<"email" | "register">("email");
  const [email, setEmail] = useState<string>("");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="p-4"
      >
        {step === "email" && (
          <EmailEntryCard
            onNext={(enteredEmail) => {
              setEmail(enteredEmail);
              setStep("register");
            }}
          />
        )}

        {step === "register" && <RegisterCard />}
      </motion.div>
    </AnimatePresence>
  );
}
