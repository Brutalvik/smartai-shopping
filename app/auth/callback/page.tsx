"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CDN } from "@/config/config";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (!code) {
        router.replace("/auth?error=missing_code");
        return;
      }

      try {
        // Exchange the auth code for Cognito tokens and user info
        const res = await fetch(
          `${CDN.cognitoAuthApi}/auth/process-social-login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ code }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        // If the user needs to choose role (signup)
        if (data.needsSignupChoice) {
          router.push(
            `/choose-role?email=${data.email}&sub=${data.cognitoUserSub}&provider=${data.socialIdp}`
          );
          return;
        }

        // Complete the social signup with account type and Cognito sub
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

        const final = await complete.json();
        if (!complete.ok || !final.isLoggedIn) {
          throw new Error(final.message || "Login failed");
        }

        localStorage.setItem("user", JSON.stringify(final.user));
        router.replace(final.redirectTo || "/");
      } catch (err: any) {
        console.error("Social login failed:", err.message || err);
        router.push("/auth?error=social_login_failed");
      }
    };

    run();
  }, [router]);

  return <XyvoLoader colorTheme="google" />;
}
// This page handles the OAuth callback from social providers
