// components/ui/RegisterCard.tsx
"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/store/hooks";
import { registerUserThunk } from "@/store/thunks/registerUser";
import { motion } from "framer-motion";

export default function RegisterCard() {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      name: Yup.string().min(2, "Too short").required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      await dispatch(registerUserThunk(values));
      setSubmitting(false);
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-xl font-bold text-center">
          Register
        </CardHeader>
        <form onSubmit={formik.handleSubmit}>
          <CardBody className="space-y-4">
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
            />
            <Input
              id="name"
              name="name"
              label="Name"
              variant="bordered"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.name && formik.errors.name)}
              errorMessage={formik.touched.name && formik.errors.name}
            />
          </CardBody>
          <CardFooter>
            <Button
              type="submit"
              variant="shadow"
              isDisabled={formik.isSubmitting}
              className="w-full"
              onPress={() => {}} // still required for HeroUI
            >
              {formik.isSubmitting ? "Registering..." : "Register"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
