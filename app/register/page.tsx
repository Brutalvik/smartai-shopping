"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/store/hooks";
import { registerUserThunk } from "@/store/thunks/registerUser";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { toast } from "react-hot-toast";

export default function Register() {
  const dispatch = useAppDispatch();
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
        const userRegistrationData = {
          email: values.email,
          name: values.name,
          password: values.password,
          preferred_locale: "en-US",
        };

        const resultAction = await dispatch(
          registerUserThunk(userRegistrationData)
        );

        if (registerUserThunk.fulfilled.match(resultAction)) {
          const user = resultAction.payload;

          // ✅ Set user in context and localStorage
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));

          toast.success("Welcome! Account created successfully.");
          setTimeout(() => {
            router.push("/");
          }, 5000);
        } else {
          toast.error(resultAction.payload || "Registration failed.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong.");
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
              label="Mobile number or email"
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
              label="Password again"
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
            <p className="text-xs text-center px-2">
              By creating an account, you agree to XYVO's{" "}
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
            <div className="text-sm text-center font-medium mt-2">
              <Link href="#" className="hover:underline hover:text-cyan-500">
                Buying for work? Create a free business account
              </Link>
            </div>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/auth" className="underline hover:text-cyan-500">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
