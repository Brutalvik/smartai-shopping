"use client";

import { useState } from "react";
import EmailEntryCard from "@/components/EmailEntryCard";
import PasswordCard from "@/components/PasswordCard";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
  );
}
