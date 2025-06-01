// components/auth/AuthFlow.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import EmailEntryCard from "@/components/EmailEntryCard";

export default function AuthFlow() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "register">("email");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (step === "register") {
      router.push(`/register?email=${encodeURIComponent(email)}`);
    }
  }, [step]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {step === "email" && (
          <EmailEntryCard
            onNext={(enteredEmail) => {
              setEmail(enteredEmail);
              setStep("register");
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
