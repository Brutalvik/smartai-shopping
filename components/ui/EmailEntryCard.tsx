// components/ui/EmailEntryCard.tsx
"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/store/hooks";
import { checkUserEmailThunk } from "@/store/thunks/checkUserEmail";
import Link from "next/link";
import { CircularProgress } from "@heroui/progress";
import { useRouter } from "next/navigation";

export default function EmailEntryCard({
  onNext,
}: {
  onNext: (email: string) => void;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const result = await dispatch(
          checkUserEmailThunk(values.email)
        ).unwrap();
        console.log("EMAIL : ", values.email);
        console.log("RESULT - ", result);

        if (!result.exists) {
          onNext(values.email);
        } else {
          // TODO: future login flow here
          setFieldError("email", "User already exists. Please login.");
        }
      } catch (err: any) {
        setFieldError("email", err);
        console.log("ERROR : ", err);
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
      <Card className="w-full max-w-md mx-auto shadow-xl backdrop-blur bg-white/5 border">
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
              label="Email"
              aria-label="Email address or mobile number"
              variant="bordered"
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
              By continuing, you agree to XYVO's{" "}
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
