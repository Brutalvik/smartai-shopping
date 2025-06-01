// app/components/auth/AuthFlow.tsx
"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/store/hooks";
import { checkUserEmailThunk } from "@/store/thunks/checkUserEmail";

export default function AuthFlow() {
  const dispatch = useAppDispatch();
  const [stage, setStage] = useState<"email" | "password" | "register">(
    "email"
  );
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async ({ email }) => {
      setIsLoading(true);
      const result = await dispatch(checkUserEmailThunk(email));

      if (checkUserEmailThunk.fulfilled.match(result)) {
        if (result.payload.exists) {
          setStage("password");
        } else {
          setStage("register");
        }
      }

      setIsLoading(false);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-2xl p-6">
        <CardHeader className="text-center">
          <img
            src="/logo/xyvo.svg"
            alt="XYVO Logo"
            className="mx-auto w-16 h-16"
          />
          <h2 className="text-xl font-bold mt-2">Welcome to XYVO</h2>
        </CardHeader>
        <CardBody>
          <AnimatePresence mode="wait">
            {stage === "email" && (
              <motion.form
                key="email-form"
                onSubmit={formik.handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  id="email"
                  type="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={formik.touched.email && formik.errors.email}
                  isInvalid={!!(formik.touched.email && formik.errors.email)}
                  variant="bordered"
                  fullWidth
                  className="mb-4"
                />
                <Button
                  type="submit"
                  variant="solid"
                  fullWidth
                  isDisabled={isLoading}
                  onPress={() => {}}
                >
                  {isLoading ? "Checking..." : "Continue"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </CardBody>
      </Card>
    </div>
  );
}
