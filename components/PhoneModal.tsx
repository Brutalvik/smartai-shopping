"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useState } from "react";
import PhoneInput from "@/components/auth/PhoneInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AnimatePresence, motion } from "framer-motion";

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPhone: (phone: string, countryCode: string) => void;
}

export default function PhoneModal({
  isOpen,
  onClose,
  onSubmitPhone,
}: PhoneModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      phone: "",
      countryCode: "+1",
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{6,15}$/, "Invalid phone number"),
      countryCode: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        onSubmitPhone(values.phone, values.countryCode);
        onClose();
      } catch (err) {
        console.error("Phone submission failed", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AnimatePresence>
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        className="max-w-lg w-full mx-auto"
        hideCloseButton
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader className="text-center text-xl font-bold">
            Confirm Your Phone Number
          </ModalHeader>

          <form onSubmit={formik.handleSubmit}>
            <ModalBody className="flex flex-col gap-4">
              <p className="text-default-500 text-sm text-center">
                We need your phone number to complete your profile.
              </p>
              <PhoneInput
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                errorMessage={formik.errors.phone}
                setFormikFieldValue={formik.setFieldValue}
                formikCountryCode={formik.values.countryCode}
              />
            </ModalBody>

            <ModalFooter className="justify-center gap-4">
              <Button
                variant="flat"
                color="danger"
                type="button"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={submitting}
                disabled={!formik.isValid || submitting}
              >
                Confirm & Continue
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </AnimatePresence>
  );
}
