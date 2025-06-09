"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { addToast } from "@heroui/react";
import { useEffect } from "react";
import { getFirstNameCapitalized } from "@/utils/helper";
import { CDN } from "@/config/config";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";
import AuthFormLayout from "@/components/auth/AuthFormLayout";
import PhoneInput from "@/components/auth/PhoneInput";
import PasswordInput from "@/components/auth/PasswordInput";
import PasswordTooltip from "@/components/ui/PasswordTooltip/PasswordTooltip";
import { passwordRules } from "@/utils/helper";

export default function SellerRegistrationCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams?.get("email") || "";
  const { setUser } = useUser();

  const formik = useFormik({
    initialValues: {
      email: prefilledEmail,
      phone: "",
      name: "",
      password: "",
      countryCode: "+1",
      businessName: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      name: Yup.string().min(2, "Too short").required("Required"),
      phone: Yup.string()
        .min(10, "Please enter a valid phone number")
        .required("Required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(passwordRules, {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
        })
        .required("Required"),
      businessName: Yup.string().min(3, "Too short").required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch(`${CDN.userAuthApi}/auth/register-seller`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            phone: values.countryCode + values.phone,
            password: values.password,
            name: values.name,
            businessName: values.businessName,
          }),
        });

        if (res.ok) {
          const { user } = await res.json();
          setUser(user);
          sessionStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem(
            "accountCreated",
            `Welcome ${getFirstNameCapitalized(values.name)}! Seller account created successfully.`
          );
          router.push("/");
        } else {
          const errorData = await res.json();
          addToast({
            description:
              errorData.message ||
              "Seller registration failed. Please try again.",
            color: "danger",
            timeout: 3000,
          });
        }
      } catch (err) {
        console.error("Client-side seller registration error:", err);
        addToast({
          description: "An unexpected error occurred. Please try again later.",
          color: "danger",
          timeout: 3000,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    formik.resetForm();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {formik.isSubmitting ? (
        <div className="w-full h-[400px] flex items-center justify-center">
          <XyvoLoader />
        </div>
      ) : (
        <AuthFormLayout
          title="Become a XYVO Seller" // Updated title
          subtitle="Register your business" // New subtitle
          alternativeAuthLink={{
            text: "Already have a seller account?",
            href: "/auth/seller-login", // Adjusted link
            linkText: "Sign in",
          }}
          showSocials={false} // Often disabled for business registrations
        >
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-2">
              <Input
                id="businessName"
                name="businessName"
                label="Business Name"
                type="text"
                variant="bordered"
                value={formik.values.businessName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!(formik.touched.businessName && formik.errors.businessName)
                }
                errorMessage={
                  formik.touched.businessName
                    ? formik.errors.businessName
                    : undefined
                }
                size="sm"
              />
              <Input
                id="name"
                name="name"
                label="Your Name (Contact Person)" // Clarified label
                type="text"
                variant="bordered"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.name && formik.errors.name)}
                errorMessage={
                  formik.touched.name ? formik.errors.name : undefined
                }
                size="sm"
              />
              <Input
                id="email"
                name="email"
                type="email"
                label="Business Email" // Clarified label
                variant="bordered"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.email && formik.errors.email)}
                errorMessage={
                  formik.touched.email ? formik.errors.email : undefined
                }
                size="sm"
              />

              <PhoneInput
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                errorMessage={
                  formik.touched.phone ? formik.errors.phone : undefined
                }
                setFormikFieldValue={formik.setFieldValue}
                formikCountryCode={formik.values.countryCode}
                size="sm"
              />

              <PasswordInput
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!(formik.touched.password && formik.errors.password)
                }
                errorMessage={
                  formik.touched.password ? formik.errors.password : undefined
                }
                size="sm"
              />

              <PasswordTooltip />
            </div>

            <div className="flex flex-col space-y-1 mt-4">
              {formik.isSubmitting ? (
                <p>Registering Seller...</p>
              ) : (
                <Button
                  type="submit"
                  variant="solid"
                  color="primary"
                  isDisabled={formik.isSubmitting}
                  className="w-full"
                >
                  Register Business
                </Button>
              )}
            </div>
          </form>
        </AuthFormLayout>
      )}
    </motion.div>
  );
}
