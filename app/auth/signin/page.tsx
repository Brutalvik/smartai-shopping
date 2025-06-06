"use client";

import { useEffect, useState } from "react";
import EmailEntryCard from "@/components/EmailEntryCard";
import PasswordCard from "@/components/PasswordCard";
import SplashScreen from "@/components/ui/XSplashScreen/XSplashScreen";
import { Image } from "@heroui/react";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [reactReady, setReactReady] = useState(false);
  const [ready, setReady] = useState(false);

  // React readiness (mounted)
  useEffect(() => {
    setReactReady(true);
  }, []);

  // Set page ready when both image and component mount are done
  useEffect(() => {
    if (reactReady && imageReady) {
      setReady(true);
    }
  }, [imageReady, reactReady]);

  return (
    <>
      {!ready && <SplashScreen />}

      <div
        className={`min-h-[90%] flex flex-col lg:flex-row transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Left image */}
        <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center">
          <Image
            src="/xbagsecure.png"
            alt="shopping bag"
            onLoad={() => setImageReady(true)}
          />
        </div>

        {/* Right form (email/password) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
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
      </div>
    </>
  );
}
