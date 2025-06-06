"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { CircularProgress } from "@heroui/progress";
import Link from "next/link";
import { CDN } from "@/config/config";
import { Image } from "@heroui/react";
import { FaUserShield } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function EmailEntryCard({
  onUserExists,
}: {
  onUserExists: (email: string) => void;
}) {
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const res = await fetch(`${CDN.userAuthApi}/auth/checkuser`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email }),
        });

        const { exists } = await res.json();
        if (exists) {
          onUserExists(values.email);
        } else {
          router.push(`register?email=${encodeURIComponent(values.email)}`);
        }
      } catch (err) {
        console.error("Check user error:", err);
        setFieldError("email", "Login check failed. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-2 w-full max-w-full mx-auto lg:mt-0 mt-[5vh] shadow-2xl backdrop-blur bg-grey/10 bg-white/10">
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
            <FaUserShield size={50} className="text-default-500" />
          </div>
          <h2 className="text-lg font-medium text-center text-default-600">
            Sign in
          </h2>
        </CardHeader>

        <form onSubmit={formik.handleSubmit}>
          <CardBody className="space-y-4">
            <Input
              isClearable
              id="email"
              name="email"
              aria-label="Email address"
              variant="bordered"
              className="w-full"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.email && formik.errors.email)}
              errorMessage={formik.touched.email && formik.errors.email}
            />
          </CardBody>

          <CardFooter className="flex flex-col space-y-2">
            <Button
              type="submit"
              variant="solid"
              isDisabled={formik.isSubmitting}
              className="w-full"
              onPress={() => {}}
              color="primary"
            >
              {formik.isSubmitting ? <CircularProgress /> : "Continue"}
            </Button>

            <p className="pt-4 text-xs text-center px-2">
              By continuing, you agree to XYVO&apos;s{" "}
              <Link
                href="/conditions"
                className="underline hover:text-cyan-500 text-white"
              >
                Conditions of Use
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline hover:text-cyan-500 text-white"
              >
                Privacy Notice
              </Link>
              .
            </p>

            <div className="text-sm text-center text-cyan-500 font-medium mt-2">
              <Link href="#" className="hover:underline">
                Need help?
              </Link>
            </div>

            <div className="text-xs text-center">
              <Link href="#" className="hover:underline">
                Forgot Password
              </Link>
              <span className="mx-1">|</span>
              <Link href="#" className="hover:underline">
                Other issues with Sign-In?
              </Link>
            </div>

            <div className="mt-3 text-center text-xs text-white/70">
              or continue with
            </div>

            <div className="flex justify-center gap-4 mt-2">
              <FcGoogle size={30} className="cursor-pointer" />
              <span className="text-white/40">|</span>
              <FaFacebook size={26} className="cursor-pointer text-blue-600" />
            </div>
          </CardFooter>
        </form>
      </Card>

      <div className="w-full max-w-md mx-auto mt-6 flex flex-col items-center space-y-4">
        <hr className="w-full border-t border-white/20" />
        <div className="text-xs tracking-wide text-center">New to XYVO?</div>
        <Button
          variant="solid"
          className="w-full"
          onPress={() => {
            router.push("/auth/register");
          }}
        >
          Create your XYVO account
        </Button>
      </div>
    </motion.div>
  );
}
