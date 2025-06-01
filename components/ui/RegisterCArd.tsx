// components/ui/RegisterCard.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Image from "next/image";
import logo from "@/public/x.png";

export default function RegisterCard({
  email,
  onRegisterSubmit,
  onBack,
}: {
  email: string;
  onRegisterSubmit: (data: { name: string; password: string }) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !password) {
      setError("All fields are required.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 1000));
    onRegisterSubmit({ name, password });
    setIsSubmitting(false);
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
        <Image src={logo} alt="Xyvo Logo" width={64} height={64} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Name"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isInvalid={!!error && !name}
        />
        <Input
          label={`Create password for ${email}`}
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isInvalid={!!error && !password}
          errorMessage={error}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onPress={onBack}
            className="w-1/3"
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="solid"
            className="w-2/3"
            isLoading={isSubmitting}
          >
            Register
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
