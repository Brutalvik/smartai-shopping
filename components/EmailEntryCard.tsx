"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Link from "next/link";
import { CDN } from "@/config/config";
import { Image } from "@heroui/react";
import { FaUserShield } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";
import { useState, useEffect } from "react";

interface AccountInfo {
  type: "Customer" | "Seller";
  poolId: string;
}

export default function EmailEntryCard({
  onUserExists,
}: {
  onUserExists: (email: string, accountInfo: AccountInfo) => void;
}) {
  const router = useRouter();
  const [userAccounts, setUserAccounts] = useState<AccountInfo[] | null>(null);
  const [enteredEmail, setEnteredEmail] = useState<string>("");

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setEnteredEmail(values.email);
      try {
        const res = await fetch(`${CDN.userAuthApi}/auth/checkuser`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email }),
        });

        const data = await res.json();

        if (data.accounts && data.accounts.length > 0) {
          setUserAccounts(data.accounts);
        } else {
          setUserAccounts([]);
        }
      } catch (err) {
        console.error("Check user error:", err);
        setFieldError("email", "Login check failed. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (userAccounts && userAccounts.length === 1) {
      onUserExists(enteredEmail, userAccounts[0]);
    }
  }, [userAccounts, enteredEmail, onUserExists]);

  const renderEmailForm = () => (
    <Card className="p-2 w-full max-w-full mx-auto lg:mt-0 shadow-2xl backdrop-blur bg-grey/10 bg-white/10">
      <CardHeader className="flex flex-col items-center justify-center space-y-2">
        <div className="flex items-center gap-4">
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
            className="w-full"
            color="primary"
          >
            Continue
          </Button>

          <p className="pt-4 text-xs text-center px-2 text-default-500">
            By continuing, you agree to XYVO&apos;s{" "}
            <Link
              href="/conditions"
              className="underline hover:text-blue-500 text-default-500"
            >
              Conditions of Use
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline hover:text-blue-500 text-default-500"
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
  );

  const renderAccountChoice = () => (
    <Card className="p-2 w-full max-w-full mx-auto lg:mt-0 shadow-2xl backdrop-blur bg-grey/10 bg-white/10">
      <CardHeader className="flex flex-col items-center justify-center space-y-2">
        <FaUserShield size={50} className="text-default-500" />
        <h2 className="text-lg font-medium text-center text-default-600">
          Sign in
        </h2>
        <p className="text-center text-default-500 px-4">
          The email <span className="text-blue-500">{enteredEmail}</span> is
          associated with multiple accounts. Please select which account
          you&apos;d like to sign into:
        </p>
      </CardHeader>

      <CardBody className="space-y-4">
        {userAccounts?.map((account) => (
          <Button
            key={account.type}
            variant="solid"
            className="w-full"
            color="primary"
            onPress={() => onUserExists(enteredEmail, account)}
          >
            Sign in as {account.type}
          </Button>
        ))}
      </CardBody>

      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-cyan-500 font-medium mt-2">
          <Link
            href="#"
            className="hover:underline"
            onClick={() => {
              setUserAccounts(null);
              setEnteredEmail("");
              formik.resetForm();
            }}
          >
            Go back
          </Link>
        </div>
      </CardFooter>
    </Card>
  );

  const renderSignupChoice = () => (
    <Card className="p-2 w-full max-w-full mx-auto lg:mt-0 shadow-2xl backdrop-blur bg-grey/10 bg-white/10">
      <CardHeader className="flex flex-col items-center justify-center space-y-2">
        <FaUserShield size={50} className="text-default-500" />
        <h2 className="text-lg font-medium text-center text-default-600">
          Register
        </h2>
        <p className="text-center text-default-500 px-4">
          No account found with{" "}
          <span className="text-blue-500">{enteredEmail}</span>. Please choose
          how you&apos;d like to sign up:
        </p>
      </CardHeader>

      <CardBody className="space-y-4">
        <Button
          variant="solid"
          className="w-full"
          color="primary"
          onPress={() =>
            router.push(
              `/auth/register?email=${encodeURIComponent(enteredEmail)}&type=customer`
            )
          }
        >
          Sign Up as Customer
        </Button>
        <Button
          variant="solid"
          className="w-full"
          color="secondary"
          onPress={() =>
            router.push(
              `/auth/register-seller?email=${encodeURIComponent(enteredEmail)}&type=seller`
            )
          }
        >
          Sign Up as Seller
        </Button>
      </CardBody>

      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-cyan-500 font-medium mt-2">
          <Link
            href="#"
            className="hover:underline"
            onClick={() => {
              setUserAccounts(null);
              setEnteredEmail("");
              formik.resetForm();
            }}
          >
            Go back
          </Link>
        </div>
      </CardFooter>
    </Card>
  );

  if (formik.isSubmitting) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full h-[400px] flex items-center justify-center"
      >
        <XyvoLoader />
      </motion.div>
    );
  }

  if (userAccounts && userAccounts.length > 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {renderAccountChoice()}
      </motion.div>
    );
  } else if (userAccounts && userAccounts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {renderSignupChoice()}
      </motion.div>
    );
  } else {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {renderEmailForm()}
      </motion.div>
    );
  }
}
