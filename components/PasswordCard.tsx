"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CDN } from "@/config/config";
import { useUser } from "@/context/UserContext";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getFirstNameCapitalized } from "@/utils/helper";
import { RiKeyFill } from "react-icons/ri";
import { Image, Link } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";

export default function PasswordCard({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Password cannot be empty."),
    }),
    onSubmit: async ({ password }) => {
      setIsSubmitting(true);
      console.log("step 1");
      try {
        console.log("step 1-try");
        const res = await fetch(`${CDN.userAuthApi}/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        console.log("accessed api");

        const { isLoggedIn, user, error } = await res.json();

        if (res.ok && isLoggedIn) {
          setUser(user);
          localStorage.setItem(
            "successfulSignin",
            `Welcome ${getFirstNameCapitalized(user.name)}`
          );
          router.push("/");
        } else {
          formik.setFieldError("password", error || "Authentication failed.");
          toast.error(error || "Invalid credentials.");
        }
      } catch (err) {
        console.log("GOT ERROR");
        console.error("Sign-in error", err);
        formik.setFieldError("password", "Unexpected error. Please try again.");
        toast.error("Network or server error.");
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
      <Card className="p-4 w-full mx-auto max-w-lg shadow-2xl backdrop-blur bg-grey/10 bg-white/10">
        <CardHeader className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Image
                src="/x.png"
                alt="XYVO Logo"
                className="h-10 w-10 object-contain"
                width={40}
                height={40}
              />
              <h1 className="text-[50px] font-semibold text-default-500">
                yvo
              </h1>
            </div>
            <RiKeyFill size={50} className="text-default-500" />
          </div>
          <h2 className="text-lg font-medium text-center text-default-600">
            Enter your password
          </h2>
        </CardHeader>

        <form onSubmit={formik.handleSubmit}>
          <CardBody className="space-y-4">
            <Input
              className="w-full"
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
                  className="focus:outline-none"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <FaEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />
          </CardBody>
          <CardFooter className="flex flex-col gap-2">
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

            <p className="text-[12px] text-center px-2 text-white/70 mt-2">
              By continuing, you agree to XYVO&apos;s{" "}
              <Link
                href="/conditions"
                className="text-[14px] underline hover:text-blue-500 text-white/70"
              >
                Conditions of Use
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-[14px] underline hover:text-blue-500 text-white/70"
              >
                Privacy Notice
              </Link>
              .
            </p>

            <div className="text-[12px] text-center text-white/80">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[14px] underline hover:text-blue-500 text-white/80"
              >
                Sign up
              </Link>
            </div>

            <div className="mt-3 text-center text-xs text-white/60">
              or continue with
            </div>

            <div className="flex justify-center items-center gap-4 mt-2">
              <FcGoogle size={30} className="cursor-pointer" />
              <span className="text-white/30 text-sm select-none">|</span>
              <FaFacebook size={26} className="cursor-pointer text-blue-600" />
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
