"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CDN } from "@/config/config";

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
        const res = await fetch(
          `${CDN.userAuthApi}/auth/process-social-login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ code }),
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        if (data.needsSignupChoice) {
          router.push(
            `/choose-role?email=${data.email}&sub=${data.cognitoUserSub}&provider=${data.socialIdp}`
          );
        } else {
          const complete = await fetch(
            `${CDN.userAuthApi}/auth/complete-social-signup`,
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

          if (final.isLoggedIn) {
            localStorage.setItem("user", JSON.stringify(final.user));
            router.replace(final.redirectTo || "/");
          } else {
            throw new Error(final.message || "Login failed");
          }
        }
      } catch (err) {
        console.error("Social login failed:", err);
        router.push("/auth?error=social_login_failed");
      }
    };

    run();
  }, []);

  return <div className="p-4">Logging you in with Google...</div>;
}
