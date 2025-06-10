"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { motion } from "framer-motion";
import { NDA_TXT } from "@/data/NDA";

export default function NdaAgreementModal() {
  const [step, setStep] = useState("view");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [serverCode, setServerCode] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const ndaAccepted = localStorage.getItem("ndaVerified");
    if (!ndaAccepted || ndaAccepted !== "true") {
      setShowModal(true);
    }
  }, []);

  //send verification code
  const sendVerificationCode = async () => {
    try {
      const res = await fetch(
        "https://ik1k816xj2.execute-api.us-east-1.amazonaws.com/nda/sendcode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("📨 Verification code sent to your email.");
        setStep("code");
      } else {
        setMessage(
          `❌ Failed to send code: ${data.message || "unknown error"}`
        );
      }
    } catch (error) {
      console.error("Send code error:", error);
      setMessage("❌ An error occurred while sending the code.");
    }
  };

  //Verify code and submit
  const verifyCodeAndSubmit = async () => {
    try {
      const res = await fetch("https://your-api.com/nda/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (res.ok) {
        await fetch("https://your-api.com/nda/accept", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: email,
            email,
            agreementVersion: "v1.0",
            acceptedAt: new Date().toISOString(),
          }),
        });

        localStorage.setItem("ndaVerified", "true");
        window.location.href = "/";
      } else {
        setMessage("❌ Invalid or expired verification code.");
      }
    } catch (error) {
      console.error("Verify error:", error);
      setMessage("❌ Verification failed. Try again.");
    }
  };

  if (!showModal) return null;

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="text-xl font-bold">NDA Agreement</CardHeader>
        <CardBody className="overflow-y-scroll max-h-[300px] whitespace-pre-wrap border rounded p-3">
          {NDA_TXT}
        </CardBody>
        <CardFooter className="flex flex-col items-start gap-4">
          {step === "view" && (
            <Button onPress={() => setStep("email")}>I Agree</Button>
          )}

          {step === "email" && (
            <div className="w-full flex flex-col gap-2">
              <Input
                label="Enter your email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onPress={() => {
                  sendVerificationCode();
                  setStep("code");
                }}
              >
                Send Verification Code
              </Button>
            </div>
          )}

          {step === "code" && (
            <div className="w-full flex flex-col gap-2">
              <Input
                label="Enter the verification code"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Button onPress={verifyCodeAndSubmit}>
                Verify and Confirm NDA
              </Button>
            </div>
          )}

          {message && <div className="text-sm text-green-500">{message}</div>}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
