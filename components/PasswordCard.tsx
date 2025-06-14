"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { CDN } from "@/config/config";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getInitial } from "@/utils/helper";
import { addToast, user } from "@heroui/react";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthFormLayout from "@/components/auth/AuthFormLayout";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";
import { setUser } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/hooks";

interface AccountInfo {
  type: "Customer" | "Seller";
  poolId: string;
  email: string;
}

export default function PasswordCard({
  email,
  userPoolId,
  accountType,
  onBack,
}: {
  email: AccountInfo["email"];
  userPoolId: AccountInfo["poolId"];
  accountType: AccountInfo["type"];
  onBack: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/");
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const redirect = new URLSearchParams(window.location.search).get(
        "redirect"
      );
      if (redirect) setRedirectTo(redirect);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Password cannot be empty."),
    }),
    onSubmit: async ({ password }) => {
      setIsSubmitting(true);
      try {
        const res = await fetch(`${CDN.userAuthApi}/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password, userPoolId, accountType }),
        });

        const { isLoggedIn, user, error } = await res.json();

        if (res.ok && isLoggedIn) {
          dispatch(setUser(user));
          router.replace(redirectTo || "/");
        } else {
          if (error === "NotAuthorizedException") {
            formik.setFieldError("password", "Wrong Password !");
            return addToast({
              description: "Wrong Password !",
              color: "danger",
              timeout: 2000,
            });
          }
          addToast({
            description: error?.message || "Incorrect username or password",
            color: "danger",
            timeout: 2000,
          });
        }
      } catch (err) {
        console.error("Sign-in error", err);
        formik.setFieldError("password", "Unexpected error. Please try again.");
        addToast({
          description: "Network or Sever Error",
          color: "danger",
          timeout: 2000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {isSubmitting ? (
        <div className="w-full h-[400px] flex items-center justify-center">
          <XyvoLoader />
        </div>
      ) : (
        <AuthFormLayout
          title="Enter your password"
          subtitle={`for ${email} (${accountType})`}
          alternativeAuthLink={{
            text: "Don't have an account?",
            href: "/auth/register",
            linkText: "Sign up",
          }}
          showSocials={true}
          showKeyIcon={true}
        >
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-3">
              <PasswordInput
                id="password"
                name="password"
                label="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!(formik.touched.password && formik.errors.password)
                }
                errorMessage={
                  formik.touched.password ? formik.errors.password : undefined
                }
                size="sm"
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <div className="flex w-full gap-2">
                <Button
                  type="button"
                  variant="bordered"
                  onPress={onBack}
                  className="w-1/3"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="solid"
                  className="w-2/3"
                  isLoading={isSubmitting}
                  color="primary"
                >
                  Log in
                </Button>
              </div>
            </div>
          </form>
        </AuthFormLayout>
      )}
    </motion.div>
  );
}
