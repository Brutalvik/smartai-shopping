// components/ui/EmailEntryCard.tsx
"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/store/hooks";
import Link from "next/link";
import { CircularProgress } from "@heroui/progress";
import { useRouter } from "next/navigation";
import { CDN } from "@/config/config";

export default function EmailEntryCard() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const redirectUri = `${window.location.origin}/auth/callback`;
        const cognitoSigninUrl = `https://${CDN.userAuthApi}/signin?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}&response_type=code&scope=openid+email+profile&redirect_uri=${redirectUri}`;

        // Simply redirect to hosted Cognito Signin (will handle both Signin and signup)
        window.location.href = cognitoSigninUrl;
      } catch (err) {
        console.error(err);
        setFieldError("email", "Login failed.");
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
      <Card className="p-4 w-full max-w-md mx-auto shadow-2xl backdrop-blur bg-grey/10 bg-white/10">
        <CardHeader className="text-xl font-semibold text-center">
          Sign in
        </CardHeader>
        <form onSubmit={formik.handleSubmit}>
          <CardBody className="space-y-4">
            <div className="text-sm font-medium text-300">
              E-mail address or mobile phone number
            </div>
            <Input
              id="email"
              name="email"
              aria-label="Email address or mobile number"
              variant="bordered"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.email && formik.errors.email)}
              errorMessage={formik.touched.email && formik.errors.email}
              size="md"
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
              By continuing, you agree to XYVOs{" "}
              <Link
                href="/conditions"
                className="underline hover:text-cyan-500"
              >
                Conditions of Use
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-cyan-500">
                Privacy Notice
              </Link>
              .
            </p>

            <div className="text-sm text-center text-cyan-500 font-medium mt-2">
              <Link href="#" className="hover:underline">
                Need help?
              </Link>
            </div>

            <div className="text-xs text-center ">
              <Link href="#" className="hover:underline">
                Forgot Password
              </Link>
              <span className="mx-1">|</span>
              <Link href="#" className="hover:underline">
                Other issues with Sign-In?
              </Link>
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
            router.push("/register");
          }}
        >
          Create your XYVO account
        </Button>
      </div>
    </motion.div>
  );
}
