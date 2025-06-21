// pages/choose-role.tsx or /app/auth/choose-role/page.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";

export default function ChooseRolePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams?.get("email");
  const sub = searchParams?.get("sub");
  const provider = searchParams?.get("provider");

  const choose = async (role: "buyer" | "seller") => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_COGNITO_AUTH_URL}/auth/complete-social-signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          cognitoUserSub: sub,
          socialIdp: provider,
          accountType: role,
        }),
      }
    );

    const data = await res.json();

    if (res.ok && data.isLoggedIn) {
      localStorage.setItem("user", JSON.stringify(data.user));
      router.replace(data.redirectTo || "/");
    } else {
      router.replace("/auth?error=signup_failed");
    }
  };

  return (
    <div className="p-6 text-center space-y-4">
      <h2 className="text-2xl font-bold">How would you like to join?</h2>
      <p className="text-gray-500">Choose your account type to continue</p>
      <div className="flex justify-center gap-4">
        <Button variant="solid" onPress={() => choose("buyer")}>
          Join as Buyer
        </Button>
        <Button variant="solid" onPress={() => choose("seller")}>
          Join as Seller
        </Button>
      </div>
    </div>
  );
}
