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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getFirstNameCapitalized } from "@/utils/helper";

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
          router.push("/");
        } else {
          formik.setFieldError("password", error || "Authentication failed.");
          toast.error(error || "Invalid credentials.");
        }
      } catch (err) {
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
        <CardHeader className="text-xl font-semibold text-center">
          Enter your password
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

          <CardFooter className="flex gap-2">
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
            >
              Log in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
