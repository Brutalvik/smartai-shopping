"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CDN } from "@/config/config";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";
import PhoneModal from "@/components//PhoneModal";

export default function CallbackPage() {
  const router = useRouter();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [pendingPhoneData, setPendingPhoneData] = useState<{
    email: string;
    accountType: string;
    socialIdp: string;
    cognitoUserSub: string;
  } | null>(null);

  useEffect(() => {
    const run = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      console.log("Social login callback initiated. Code received:", !!code); // Log if code exists

      if (!code) {
        console.error("Error: Missing authorization code in callback URL.");
        router.replace("/auth?error=missing_code");
        return;
      }

      try {
        console.log("Attempting to call process-social-login endpoint...");
        const res = await fetch(
          `${CDN.cognitoAuthApi}/auth/process-social-login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ code }),
          }
        );

        console.log("Response status from process-social-login:", res);

        if (!res.ok) {
          const errorData = await res.json();
          console.error(
            "Social login process failed at /auth/process-social-login:",
            res.status,
            res.statusText,
            errorData
          );
          throw new Error(
            errorData.message || "Failed to process social login with backend."
          );
        }

        const data = await res.json();
        console.log("Response from process-social-login:", data);

        console.log("Attempting to complete social signup...");
        const complete = await fetch(
          `${CDN.cognitoAuthApi}/auth/complete-social-signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              email: data.email,
              accountType: data.accountType,
              socialIdp: data.socialIdp,
              cognitoUserSub: data.cognitoUserSub,
            }),
          }
        );

        if (!complete.ok) {
          const errorData = await complete.json();
          console.error(
            "Social signup completion failed:",
            complete.status,
            complete.statusText,
            errorData
          );
          throw new Error(
            errorData.message || "Login failed after completion."
          );
        }

        const final = await complete.json();
        if (!final.isLoggedIn) {
          throw new Error(final.message || "Login failed after completion.");
        }

        console.log("Social login successful. Redirecting.");
        localStorage.setItem("user", JSON.stringify(final.user));
        router.replace(final.redirectTo || "/");
      } catch (err: any) {
        console.error("Social login flow error:", err.message || err);
        router.replace(
          `/auth?error=${encodeURIComponent(err.message || "social_login_failed")}`
        );
      }
    };

    run();
  }, [router]);

  const handlePhoneSubmit = async (phone: string, countryCode: string) => {
    if (!pendingPhoneData) {
      console.warn("Attempted phone submit without pending phone data.");
      return;
    }
    try {
      console.log("Submitting phone number...");
      const res = await fetch(`${CDN.cognitoAuthApi}/auth/add-phone`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          countryCode,
          email: pendingPhoneData.email,
          cognitoUserSub: pendingPhoneData.cognitoUserSub,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add phone number");
      }
      console.log(
        "Phone number added successfully. Retrying signup completion."
      );

      // Retry completing the signup
      const complete = await fetch(
        `${CDN.cognitoAuthApi}/auth/complete-social-signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: pendingPhoneData.email,
            accountType: pendingPhoneData.accountType,
            socialIdp: pendingPhoneData.socialIdp,
            cognitoUserSub: pendingPhoneData.cognitoUserSub,
          }),
        }
      );

      const final = await complete.json();

      if (!complete.ok || !final.isLoggedIn) {
        throw new Error(final.message || "Login failed after phone");
      }

      localStorage.setItem("user", JSON.stringify(final.user));
      router.replace(final.redirectTo || "/");
    } catch (err: any) {
      console.error("Phone number submission failed:", err.message);
      router.replace(
        `/auth?error=${encodeURIComponent(err.message || "phone_entry_failed")}`
      );
    }
  };

  return (
    <>
      <XyvoLoader colorTheme="google" />
      <PhoneModal
        isOpen={showPhoneModal}
        onClose={() => {
          console.log("Phone modal closed, redirecting to home/auth.");
          router.replace("/"); // Or /auth, depending on desired behavior
        }}
        onSubmitPhone={handlePhoneSubmit}
      />
    </>
  );
}
