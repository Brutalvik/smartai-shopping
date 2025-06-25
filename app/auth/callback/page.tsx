"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CDN } from "@/config/config";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";
import PhoneModal from "@/components/PhoneModal";
import { useAppDispatch } from "@/store/hooks/hooks";
import { setUser } from "@/store/slices/userSlice";

export default function CallbackPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [pendingPhoneData, setPendingPhoneData] = useState<{
    email: string;
    accountType: string;
    socialIdp: string;
    cognitoUserSub: string;
    phone?: string;
    name?: string;
    givenName?: string;
    familyName?: string;
  } | null>(null);

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
          `${CDN.cognitoSocialAuthApi}/auth/process-social-login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ code }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        if (data.isLoggedIn && data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch(setUser(data.user));
          router.replace(data.redirectTo || "/");
          return;
        }

        if (data.needsSignupChoice && !data.phoneNumber) {
          setPendingPhoneData({
            email: data.email,
            accountType: data.accountType || "buyer",
            socialIdp: data.socialIdp,
            cognitoUserSub: data.cognitoUserSub,
            name: data.name,
            givenName: data.givenName,
            familyName: data.familyName,
          });
          setShowPhoneModal(true);
          return;
        }

        if (data.needsSignupChoice && data.phoneNumber) {
          router.push(
            `/auth/choose-role?email=${data.email}&sub=${data.cognitoUserSub}&provider=${data.socialIdp}&phone=${data.phoneNumber}`
          );
        }
      } catch (err: any) {
        console.error("Social login failed:", err.message || err);
        router.replace("/auth?error=social_login_failed");
      }
    };

    run();
  }, [router, dispatch]);

  const handlePhoneSubmit = async (phone: string, countryCode: string) => {
    if (!pendingPhoneData) return;
    const fullPhone = `${countryCode}-${phone}`;
    const updatedData = { ...pendingPhoneData, phone: fullPhone };
    setPendingPhoneData(updatedData);
    router.push(
      `/auth/choose-role?email=${updatedData.email}&sub=${updatedData.cognitoUserSub}&provider=${updatedData.socialIdp}&phone=${updatedData.phone}`
    );
    setShowPhoneModal(false);
  };

  return (
    <>
      <XyvoLoader colorTheme="google" />
      <PhoneModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSubmitPhone={handlePhoneSubmit}
      />
    </>
  );
}
