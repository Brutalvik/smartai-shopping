"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { toast } from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get("email") || "";
  const { setUser } = useUser();

  const formik = useFormik({
    initialValues: {
      email: prefilledEmail,
      name: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      name: Yup.string().min(2, "Too short").required("Required"),
      password: Yup.string()
        .min(6, "At least 6 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Optional: Call your API if needed
        const mockUser = {
          id: "temp-id",
          email: values.email,
          firstName: values.name,
        };
        setUser(mockUser);
        sessionStorage.setItem("user", JSON.stringify(mockUser));
        toast.success("Account created!");
        router.push("/");
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSocialLogin = (provider: "google" | "facebook") => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/social/${provider}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-4 w-full max-w-md mx-auto shadow-2xl backdrop-blur bg-white/10">
        <CardHeader className="text-xl font-bold text-center">
          Create account
        </CardHeader>
        <form onSubmit={formik.handleSubmit}>
          <CardBody className="space-y-4">
            <Input
              id="name"
              name="name"
              label="Your name"
              placeholder="First and last name"
              variant="bordered"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.name && formik.errors.name)}
              errorMessage={formik.touched.name && formik.errors.name}
              size="sm"
            />
            <Input
              id="email"
              name="email"
              label="Email"
              variant="bordered"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.email && formik.errors.email)}
              errorMessage={formik.touched.email && formik.errors.email}
              size="sm"
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="At least 6 characters"
              variant="bordered"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.password && formik.errors.password)}
              errorMessage={formik.touched.password && formik.errors.password}
              size="sm"
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              variant="bordered"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                !!(
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                )
              }
              errorMessage={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              size="sm"
            />
          </CardBody>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              type="submit"
              variant="solid"
              color="primary"
              isDisabled={formik.isSubmitting}
              className="w-full"
              onPress={() => {}}
            >
              {formik.isSubmitting ? "Registering..." : "Continue"}
            </Button>
          </CardFooter>
        </form>

        <div className="my-4 text-center text-sm text-white/70">
          or sign up with
        </div>
        <div className="flex flex-col gap-3 px-4">
          <Button
            onPress={() => handleSocialLogin("google")}
            className="w-full bg-white text-black border"
            variant="flat"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 11h8.3c.1.5.2 1 .2 1.5s-.1 1-.2 1.5h-8.3v-3z"
              />
              <path
                fill="#34A853"
                d="M3.9 13.1c-.1-.5-.2-1-.2-1.5s.1-1 .2-1.5l4-3.1 3 2.3-1.6 2.3 1.6 2.3-3 2.3-4-3.1z"
              />
              <path
                fill="#FBBC05"
                d="M12 5c1.3 0 2.5.4 3.5 1.1l2.6-2.6C16.6 2.5 14.4 2 12 2 7.5 2 3.7 4.9 2.3 8.8l3.2 2.5C6.5 7.9 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M12 19c2.4 0 4.6-.5 6.1-1.5l-3.1-2.5C13.9 15.6 13 16 12 16c-3 0-5.5-2.9-6.5-6.3l-3.2 2.5C3.7 19.1 7.5 22 12 22z"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            onPress={() => handleSocialLogin("facebook")}
            className="w-full bg-[#3b5998] text-white"
            variant="flat"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22 12.07C22 6.58 17.52 2 12 2S2 6.58 2 12.07c0 5 3.66 9.14 8.44 9.93v-7.02h-2.54V12h2.54V9.85c0-2.5 1.5-3.89 3.8-3.89 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.98h-2.34v7.02C18.34 21.21 22 17.07 22 12.07z" />
            </svg>
            Continue with Facebook
          </Button>
        </div>

        <div className="mt-4 text-sm text-center text-white/70">
          Already have an account?{" "}
          <Link href="/auth" className="underline hover:text-cyan-400">
            Sign in
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
