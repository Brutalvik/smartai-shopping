"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Image } from "@heroui/react";
import SplashScreen from "@/components/ui/XSplashScreen/XSplashScreen";

// Dynamically import RegisterCard without wrapping or fallback
const RegisterCard = dynamic(() => import("@/components/RegisterCard"), {
  loading: () => null,
  ssr: false,
});

function RegisterCardLoaded({
  setCardReady,
}: {
  setCardReady: (val: boolean) => void;
}) {
  useEffect(() => {
    setCardReady(true);
  }, [setCardReady]);

  return <RegisterCard />;
}

export default function RegisterPage() {
  const [imageReady, setImageReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [ready, setReady] = useState(false);

  // Signal that both image and card are ready
  useEffect(() => {
    if (imageReady && cardReady) {
      setReady(true);
    }
  }, [imageReady, cardReady]);

  return (
    <>
      {!ready && <SplashScreen />}

      <div
        className={`min-h-[90%] flex flex-col lg:flex-row transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Left image side */}
        <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center">
          <Image
            src="/xbagsecure.png"
            alt="shopping bag"
            onLoad={() => setImageReady(true)}
          />
        </div>

        {/* Right register form side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          {typeof window !== "undefined" && RegisterCard && (
            <RegisterCardLoaded setCardReady={setCardReady} />
          )}
        </div>
      </div>
    </>
  );
}
