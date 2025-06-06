"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Image from "next/image";
import logo from "@/public/x.png";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CDN } from "@/config/config";
import { useUser } from "@/context/UserContext";

export default function PasswordCard({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${CDN.userAuthApi}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const { isLoggedIn, message, user, error } = await res.json();

      if (res.ok && isLoggedIn) {
        setUser(user);
        localStorage.setItem("successfulSignin", `Welcome ${user.name}`);
        router.push("/");
      } else {
        setError(error || "Authentication failed.");
        toast.error(error || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Sign-in error", err);
      setError("Unexpected error. Please try again.");
      toast.error("Network or server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-md w-full mx-auto p-8 rounded-2xl shadow-2xl border border-slate-200"
    >
      <div className="flex justify-center mb-6">
        <Image src={logo} alt="Xyvo Logo" width={64} height={64} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={`Enter password for ${email}`}
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isInvalid={!!error}
          errorMessage={error}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="bordered"
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
            Log in
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
