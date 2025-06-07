"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { useRouter } from "next/navigation";
import { CDN } from "@/config/config";
import { useUser } from "@/context/UserContext";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getFirstNameCapitalized } from "@/utils/helper";
import { RiKeyFill } from "react-icons/ri";
import { Link } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";
import { addToast } from "@heroui/react";

export default function PasswordCard({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/");
  const router = useRouter();
  const { setUser } = useUser();

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const redirect = new URLSearchParams(window.location.search).get("redirect");
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
          body: JSON.stringify({ email, password }),
        });

        const { isLoggedIn, user, error } = await res.json();

        if (res.ok && isLoggedIn) {
          setUser(user);
          localStorage.setItem(
            "successfulSignin",
            `Welcome ${getFirstNameCapitalized(user.name)}`
          );
          router.replace(redirectTo || "/");
        } else {
          formik.setFieldError("password", error || "Authentication failed.");
          addToast({
            description: error || "Invalid Credentials",
            color: "danger",
            timeout: 1500,
          })
        }
      } catch (err) {
        console.error("Sign-in error", err);
        formik.setFieldError("password", "Unexpected error. Please try again.");
        addToast({
          description: "Network or Sever Error",
          color: "danger",
          timeout: 1500,
        })
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
        <Card className="p-2 w-full max-w-full mx-auto lg:mt-0 mt-[5vh] shadow-2xl backdrop-blur bg-grey/10 bg-white/10">
          <CardHeader className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center gap-4">
              {/* <div className="flex items-center gap-1">
                <Image
                  src="/x.png"
                  alt="XYVO Logo"
                  className="h-10 w-10 object-contain"
                  width={40}
                  height={40}
                />
              </div> */}
              <RiKeyFill size={50} className="text-default-500" />
            </div>
            <h2 className="text-lg font-medium text-center text-default-600">
              Enter your password
            </h2>
          </CardHeader>

          <form onSubmit={formik.handleSubmit}>
            <CardBody className="px-1 pt-2 pb-1 space-y-3">
              <Input
                className="w-full"
                size="sm"
                label={`Password for ${email}`}
                id="password"
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.password && !!formik.errors.password}
                errorMessage={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : undefined
                }
                variant="bordered"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="focus:outline-none"
                  >
                    {isPasswordVisible ? (
                      <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                    ) : (
                      <FaEye className="text-xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
            </CardBody>

            <CardFooter className="flex flex-col gap-3 px-2 pb-2">
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

              <p className="pt-4 text-xs text-center px-2 text-default-500">
                  By continuing, you agree to XYVO&apos;s{" "}
                  <Link
                    href="/conditions"
                    className="text-xs underline hover:text-blue-500 text-default-500 ml-1 mr-1"
                  >
                    Conditions of Use
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-xs underline hover:text-blue-500 text-default-500 ml-1 mr-1"
                  >
                    Privacy Notice
                  </Link>
                  .
                </p>

              <div className="text-xs text-center text-default-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-xs underline hover:text-blue-500 text-default-500 ml-1 mr-1"
                >
                  Sign up
                </Link>
              </div>

              <div className="mt-2 text-center text-xs text-white/60">
                or continue with
              </div>

              <div className="flex justify-center items-center gap-4 mt-1">
                <FcGoogle size={26} className="cursor-pointer" />
                <span className="text-white/30 text-sm select-none">|</span>
                <FaFacebook
                  size={24}
                  className="cursor-pointer text-blue-600"
                />
              </div>
            </CardFooter>
          </form>
        </Card>
      )}
    </motion.div>
  );
}
