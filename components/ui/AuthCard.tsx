// components/ui/AuthCard.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Image from "next/image";

export default function AuthCard({
  onEmailSubmit,
}: {
  onEmailSubmit: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Simulate check (replace with actual API call)
    const exists = await mockCheckUserExists(email);
    setIsSubmitting(false);

    if (!email) return setError("Email is required.");

    onEmailSubmit(email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-slate-200"
    >
      <div className="flex justify-center mb-6">
        <Image src="/x.png" alt="Xyvo Logo" width={64} height={64} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Enter your email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isInvalid={!!error}
          errorMessage={error}
          placeholder="you@xyvo.ai"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Button
            type="submit"
            variant="solid"
            className="w-full"
            isLoading={isSubmitting}
          >
            Continue
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}

// Mock function to simulate DB check
async function mockCheckUserExists(email: string): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 1000));
  return email.toLowerCase().endsWith("@xyvo.ai");
}
