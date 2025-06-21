// components/auth/GoogleLoginButton.tsx
"use client";

import { useCallback } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@heroui/button";

export default function GoogleLoginButton() {
  const handleGoogleLogin = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const domain = process.env.NEXT_PUBLIC_COGNITO_CUSTOMER_DOMAIN;
    const region = process.env.NEXT_PUBLIC_XYVO_REGION;
    const redirectUri = encodeURIComponent(
      process.env.NEXT_PUBLIC_AUTH_URL || ""
    );

    const url =
      `https://${domain}/oauth2/authorize?` +
      `response_type=code&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}&identity_provider=Google`;

    window.location.href = url;
  }, []);

  return (
    <Button
      onPress={handleGoogleLogin}
      startContent={<FcGoogle size={18} />}
      variant="bordered"
      color="default"
      className="w-full text-sm"
    >
      Continue with Google
    </Button>
  );
}
