"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { toast } from "react-hot-toast";
import { Select, SelectItem } from "@heroui/react";
import { useState, useEffect } from "react";
import { countryCodes } from "@/data/countryCodes";
import { getFirstNameCapitalized, getFlagFromPhone } from "@/utils/helper";
import { Tooltip } from "@heroui/react";
import { FcInfo } from "react-icons/fc";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { CDN } from "@/config/config";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
// min 8 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

export default function Register() {
  const [selectedCode, setSelectedCode] = useState("+1");
  const [flag, setFlag] = useState("🇺🇸");

  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get("email") || "";
  const { setUser } = useUser();

  const formik = useFormik({
    initialValues: {
      email: prefilledEmail,
      phone: "",
      name: "",
      password: "",
      confirmPassword: "",
      countryCode: selectedCode,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      name: Yup.string().min(2, "Too short").required("Required"),
      phone: Yup.string().min(10, "Too short").required("Required"),
      password: Yup.string()
        .min(8)
        .matches(passwordRules, {
          message: "Please create a stronger password",
        })
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch(
          `https://m1pozl1jdg.execute-api.us-east-2.amazonaws.com/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: values.email,
              phone: values.countryCode + values.phone,
              password: values.password,
              name: values.name,
            }),
          }
        );

        if (res.ok) {
          const user = await res.json();
          setUser(user);
          sessionStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem(
            "toastMessage",
            `Welcome ${getFirstNameCapitalized(values.name)}! Account created successfully.`
          );
          router.push("/");
        } else {
          const error = await res.json();
          toast.error(error.message || "Registration failed.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCodeChange = (code: string) => {
    setSelectedCode(code);
    formik.setFieldValue("countryCode", code);

    const selected = countryCodes.find((c) => c.dial_code === code);
    if (selected) setFlag(selected.flag);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    formik.setFieldValue("phone", phone);

    const digits = phone.replace(/\D/g, "");
    if (selectedCode === "+1" && digits.length >= 3) {
      const dynamicFlag = getFlagFromPhone(digits);
      if (dynamicFlag !== flag) {
        setFlag(dynamicFlag);
      }
    }
  };

  useEffect(() => {
    const initialCountry = countryCodes.find((c) => c.dial_code === "+1");
    if (initialCountry) {
      setFlag(initialCountry.flag);
      formik.setFieldValue("countryCode", "+1");
    }
  }, []);

  const handleSocialLogin = (provider: "google" | "facebook") => {
    window.location.href = `${CDN.userAuthApi}/auth/social/${provider}`;
  };

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
              type="text"
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
              type="email"
              label="Mobile number or email"
              variant="bordered"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.email && formik.errors.email)}
              errorMessage={formik.touched.email && formik.errors.email}
              size="sm"
            />

            {/* Flag + Country Code + Phone Number */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <div className="flex items-center gap-2 w-full sm:w-1/3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={flag}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl"
                  >
                    {flag}
                  </motion.span>
                </AnimatePresence>
                <Select
                  variant="bordered"
                  aria-labelledby="country code"
                  selectedKeys={new Set([selectedCode])}
                  onSelectionChange={(keys) => {
                    const code = Array.from(keys)[0];
                    handleCodeChange(code as string);
                  }}
                  className="w-full"
                  renderValue={() => (
                    <div className="flex items-center gap-2">
                      <span>{selectedCode}</span>
                    </div>
                  )}
                  size="lg"
                >
                  {countryCodes.map((country, index) =>
                    country.code === "CA" ? null : (
                      <SelectItem
                        key={country.dial_code}
                        textValue={country.dial_code}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm t<span>{flag}</span>ext-white/60">
                            {country.code}
                          </span>
                          <span>{country.dial_code}</span>
                        </div>
                      </SelectItem>
                    )
                  )}
                </Select>
              </div>
              <Input
                id="phone"
                name="phone"
                label="Phone Number"
                placeholder="Enter your number"
                variant="bordered"
                value={formik.values.phone}
                onChange={handlePhoneChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                errorMessage={formik.touched.phone && formik.errors.phone}
                className="w-full sm:w-2/3"
                size="sm"
              />
            </div>

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="At least 8 characters"
              variant="bordered"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.password && formik.errors.password)}
              errorMessage={formik.touched.password && formik.errors.password}
              size="sm"
            />
            <div className="flex flex-row items-center gap-2 w-full">
              <p className="text-xs text-center px-2">Password instructions</p>
              <span>
                <Tooltip
                  content={
                    <div className="px-1 py-2">
                      <div className="text-small font-bold text-blue-500">
                        Password Rules
                      </div>
                      <span className="text-tiny">
                        <ul>
                          <li>Minimum 8 characters</li>
                          <li>One uppercase character</li>
                          <li>One lowercase character</li>
                          <li>One number</li>
                        </ul>
                      </span>
                    </div>
                  }
                >
                  <FcInfo size={15} className="hover:cursor-pointer" />
                </Tooltip>
              </span>
            </div>
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
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/auth" className="underline hover:text-cyan-500">
                Sign in
              </Link>
            </div>
            <div className="my-4 text-center text-sm text-white/70">
              or sign up with
            </div>
            <div className="flex flex-row justify-center items-center gap-4 w-full">
              <FcGoogle size={35} className="hover:cursor-pointer" />
              <FaFacebook size={30} className="hover:cursor-pointer" />
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
