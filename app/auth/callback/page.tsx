"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CDN } from "@/config/config";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";
import PhoneModal from "@/components//PhoneModal";
import { useAppDispatch } from "@/store/hooks/hooks";
import { setUser } from "@/store/slices/userSlice";

export default function CallbackPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [pendingPhoneData, setPendingPhoneData] = useState<{
    email: string;
    accountType: string;
    socialIdp: string;
    cognitoUserSub: string;
    phone?: string;
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
        console.log("data : ", data);

        if (data.needsSignupChoice) {
          router.push(
            `/auth/choose-role?email=${data.email}&sub=${data.cognitoUserSub}&provider=${data.socialIdp}&phone=${data.phoneNumber}`
          );
          setPendingPhoneData({
            email: data.email,
            accountType: data.accountType,
            socialIdp: data.socialIdp,
            cognitoUserSub: data.cognitoUserSub,
          });
          setShowPhoneModal(true);
          const complete = await fetch(
            `${CDN.cognitoSocialAuthApi}/auth/complete-social-signup`,
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
          dispatch(setUser(data.user));
          router.replace(final.redirectTo || "/");
          return;
        }
      } catch (err: any) {
        console.error("Social login failed:", err.message || err);
        router.replace("/auth?error=social_login_failed");
      }
    };

    run();
  }, [router]);

  const handlePhoneSubmit = async (phone: string, countryCode: string) => {
    if (!pendingPhoneData) return;

    const fullPhone = `${countryCode}-${phone}`;

    const updatedData = {
      ...pendingPhoneData,
      phone: fullPhone,
    };

    setPendingPhoneData(updatedData);

    console.log("UPDATED DATA : ", updatedData);

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
