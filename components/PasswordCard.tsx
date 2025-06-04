"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Image from "next/image";
import logo from "@/public/x.png";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CDN } from "@/config/config";

const client = new CognitoIdentityProviderClient({
  region: CDN.awsRegion,
});

export default function PasswordCard({
  email,
  onPasswordSubmit,
  onBack,
}: {
  email: string;
  onPasswordSubmit: (password: string) => void;
  onBack: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CDN.cognitoClientId!,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });

      const response = await client.send(command);

      const idToken = response.AuthenticationResult?.IdToken;
      const accessToken = response.AuthenticationResult?.AccessToken;

      if (idToken && accessToken) {
        // ✅ Call your Fastify backend to set a secure session cookie
        await fetch(`${CDN.userAuthApi}/auth/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // send cookie back
          body: JSON.stringify({ idToken }),
        });

        toast.success("Signed in successfully!");
        onPasswordSubmit(password);
        router.push("/");
      } else {
        setError("Authentication failed.");
      }
    } catch (err: any) {
      console.error("Sign-in error", err);
      toast.error("Invalid credentials or error signing in.");
      setError("Invalid email or password.");
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
      className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-slate-200"
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
            Log in
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
