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
import { Select, SelectItem, Tooltip } from "@heroui/react";
import { useState, useEffect } from "react";
import { countryCodes } from "@/data/countryCodes";
import { getFirstNameCapitalized, getFlagFromPhone } from "@/utils/helper";
import { FcInfo, FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { CDN } from "@/config/config";
import { Image } from "@heroui/react";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export default function RegisterCard() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState("+1");
  const [flag, setFlag] = useState("🇺🇸");

  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get("email") || "";
  const { setUser } = useUser();

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const formik = useFormik({
    initialValues: {
      email: prefilledEmail,
      phone: "",
      name: "",
      password: "",
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
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch(`${CDN.userAuthApi}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            phone: values.countryCode + values.phone,
            password: values.password,
            name: values.name,
          }),
        });

        if (res.ok) {
          const { user } = await res.json();
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
      if (dynamicFlag !== flag) setFlag(dynamicFlag);
    }
  };

  useEffect(() => {
    const initialCountry = countryCodes.find((c) => c.dial_code === "+1");
    if (initialCountry) {
      setFlag(initialCountry.flag);
      formik.setFieldValue("countryCode", "+1");
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {formik.isSubmitting ? (
        // Loader view while submitting
        <div className="w-full h-[400px] flex items-center justify-center">
          <XyvoLoader />
        </div>
      ) : (
        // Regular card view
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
                {/* <h1 className="text-[50px] font-semibold text-default-500">
                yvo
              </h1> */}
              </div>
            </div>
            <h2 className="text-lg font-medium text-center text-default-600">
              Sign in
            </h2>
          </CardHeader>

          <form onSubmit={formik.handleSubmit}>
            <CardBody className="space-y-2">
              <Input
                id="name"
                name="name"
                label="Your name"
                type="text"
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
                label="Email"
                variant="bordered"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.email && formik.errors.email)}
                errorMessage={formik.touched.email && formik.errors.email}
                size="sm"
              />

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-2 w-full sm:w-1/3">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={flag}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-xl"
                    >
                      {flag}
                    </motion.span>
                  </AnimatePresence>
                  <Select
                    variant="bordered"
                    size="md"
                    className="w-full"
                    selectedKeys={new Set([selectedCode])}
                    onSelectionChange={(keys) => {
                      const code = Array.from(keys)[0];
                      handleCodeChange(code as string);
                    }}
                    renderValue={() => <span>{selectedCode}</span>}
                  >
                    {countryCodes.map((country) =>
                      country.code === "CA" ? null : (
                        <SelectItem
                          key={country.dial_code}
                          textValue={country.dial_code}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/60">
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
                  label="Phone"
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
                type={isPasswordVisible ? "text" : "password"}
                label="Password"
                placeholder="At least 8 characters"
                variant="bordered"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!(formik.touched.password && formik.errors.password)
                }
                errorMessage={formik.touched.password && formik.errors.password}
                size="sm"
                endContent={
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="h-full flex items-center pr-2"
                  >
                    {isPasswordVisible ? (
                      <FaEyeSlash className="text-lg text-default-400 pointer-events-none" />
                    ) : (
                      <FaEye className="text-lg text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />

              <div className="flex items-center gap-1 text-xs">
                <span>Password instructions</span>
                <Tooltip
                  content={
                    <div className="px-2 py-1 text-xs">
                      <strong className="text-blue-500">Password Rules</strong>
                      <ul className="list-disc pl-4">
                        <li>Min 8 characters</li>
                        <li>1 uppercase</li>
                        <li>1 lowercase</li>
                        <li>1 number</li>
                      </ul>
                    </div>
                  }
                >
                  <FcInfo size={14} className="cursor-pointer" />
                </Tooltip>
              </div>
            </CardBody>

            <CardFooter className="flex flex-col space-y-1">
              {formik.isSubmitting ? (
                <p>Registring</p>
              ) : (
                <Button
                  type="submit"
                  variant="solid"
                  color="primary"
                  isDisabled={formik.isSubmitting}
                  className="w-full"
                >
                  Continue
                </Button>
              )}

              <p className="text-xs text-center px-2">
                By creating an account, you agree to XYVO’s{" "}
                <Link
                  href="/conditions"
                  className="underline hover:text-blue-500"
                >
                  Conditions of Use
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-blue-500">
                  Privacy Notice
                </Link>
                .
              </p>

              <div className="text-xs text-center">
                Already have an account?{" "}
                <Link href="/auth" className="underline hover:text-blue-500">
                  Sign in
                </Link>
              </div>

              <div className="mt-3 text-center text-xs text-white/70">
                or sign up with
              </div>

              <div className="flex justify-center gap-4 mt-2">
                <FcGoogle size={30} className="cursor-pointer" />
                <FaFacebook
                  size={26}
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
