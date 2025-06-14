// components/seller/SellerRegistrationCard.tsx
"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { useEffect } from "react";
import { CDN } from "@/config/config";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";

import AuthFormLayout from "@/components/auth/AuthFormLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import PhoneInput from "@/components/auth/PhoneInput";

import PasswordTooltip from "@/components/ui/PasswordTooltip/PasswordTooltip";
import { setUser } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/hooks/hooks";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export default function SellerRegistrationCard() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      countryCode: "+1", // Initialize countryCode here
      businessName: "",
      businessAddress: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name too short")
        .required("Your name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string()
        .min(10, "Invalid phone number")
        .required("Phone is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(passwordRules, {
          message: "Must contain 1 uppercase, 1 lowercase, 1 number",
        })
        .required("Password is required"),
      businessName: Yup.string()
        .min(2, "Business name too short")
        .required("Business name is required"),
      businessAddress: Yup.string()
        .min(5, "Address too short")
        .required("Business address is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await fetch(`${CDN.userAuthApi}/auth/register-seller`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            phone: values.countryCode + values.phone,
            password: values.password,
            businessName: values.businessName,
            businessAddress: values.businessAddress,
          }),
        });

        if (res.ok) {
          const { user } = await res.json();
          dispatch(setUser(user));
          router.push("/seller/dashboard");
          resetForm();
        } else {
          const error = await res.json();
          addToast({
            description: error.message || "Seller registration failed.",
            color: "danger",
            timeout: 3000,
          });
        }
      } catch (err) {
        console.error(err);
        addToast({
          description: "Something went wrong during seller registration!",
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
    <>
      {formik.isSubmitting ? (
        <div className="w-full flex items-center justify-center">
          <XyvoLoader />
        </div>
      ) : (
        <AuthFormLayout
          title="Become a Seller"
          subtitle="Register your account and business to start selling."
          showSocials={false}
          alternativeAuthLink={{
            text: "Already have an account?",
            href: "/auth/signin",
            linkText: "Sign in",
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-2">
              <Input
                id="name"
                name="name"
                label="Your Name"
                type="text"
                variant="bordered"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.name && formik.errors.name)}
                errorMessage={
                  formik.touched.name && formik.errors.name
                    ? String(formik.errors.name)
                    : undefined
                }
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
                errorMessage={
                  formik.touched.email && formik.errors.email
                    ? String(formik.errors.email)
                    : undefined
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
                  formik.touched.phone && formik.errors.phone
                    ? String(formik.errors.phone)
                    : undefined
                }
                setFormikFieldValue={formik.setFieldValue}
                formikCountryCode={formik.values.countryCode}
                size="sm"
              />
              <PasswordTooltip />
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
                  formik.touched.password && formik.errors.password
                    ? String(formik.errors.password)
                    : undefined
                }
                size="sm"
              />
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
                  formik.touched.businessName && formik.errors.businessName
                    ? String(formik.errors.businessName)
                    : undefined
                }
                size="sm"
              />
              <Input
                id="businessAddress"
                name="businessAddress"
                label="Business Address"
                type="text"
                variant="bordered"
                value={formik.values.businessAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!(
                    formik.touched.businessAddress &&
                    formik.errors.businessAddress
                  )
                }
                errorMessage={
                  formik.touched.businessAddress &&
                  formik.errors.businessAddress
                    ? String(formik.errors.businessAddress)
                    : undefined
                }
                size="sm"
              />
            </div>

            <Button
              type="submit"
              variant="solid"
              color="primary"
              isDisabled={formik.isSubmitting}
              className="w-full mt-4"
            >
              {formik.isSubmitting
                ? "Registering as Seller..."
                : "Register & Sell"}
            </Button>
          </form>
        </AuthFormLayout>
      )}
    </>
  );
}
