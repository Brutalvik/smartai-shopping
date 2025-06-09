// components/auth/PhoneInput.tsx
"use client";

import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { useState, useEffect, ChangeEvent, FocusEvent } from "react";
import { countryCodes } from "@/data/countryCodes";
import { AnimatePresence, motion } from "framer-motion";
import { getFlagFromPhone } from "@/utils/helper";

interface PhoneInputProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  isInvalid: boolean;
  errorMessage?: string;
  size?: "sm" | "md" | "lg";
  setFormikFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => void;
  formikCountryCode: string; // The countryCode value from Formik's state
}

export default function PhoneInput({
  id,
  name,
  label = "Phone Number",
  placeholder = "e.g., 780 123 4567",
  value,
  onChange,
  onBlur,
  isInvalid,
  errorMessage,
  size = "sm",
  setFormikFieldValue,
  formikCountryCode,
}: PhoneInputProps) {
  const [selectedCode, setSelectedCode] = useState(formikCountryCode);
  const [flag, setFlag] = useState("🇺🇸");

  useEffect(() => {
    setSelectedCode(formikCountryCode);
    const initialCountry = countryCodes.find(
      (c) => c.dial_code === formikCountryCode
    );
    if (initialCountry) {
      setFlag(initialCountry.flag);
    } else {
      setFlag("🌐");
    }
  }, [formikCountryCode]);

  const handleCodeChange = (code: string) => {
    setSelectedCode(code);
    setFormikFieldValue("countryCode", code);
    const selected = countryCodes.find((c) => c.dial_code === code);
    if (selected) {
      setFlag(selected.flag);
    } else {
      setFlag("🌐");
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);

    const phone = e.target.value;
    const digits = phone.replace(/\D/g, "");
    if (selectedCode === "+1" && digits.length >= 3) {
      const dynamicFlag = getFlagFromPhone(digits);
      if (dynamicFlag && dynamicFlag !== flag) {
        setFlag(dynamicFlag);
      }
    }
  };

  return (
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
          aria-label="Country Code"
        >
          {countryCodes.map((country) =>
            country.code === "CA" ? null : (
              <SelectItem key={country.dial_code} textValue={country.dial_code}>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60">{country.code}</span>
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
        value={value}
        onChange={handlePhoneChange}
        onBlur={onBlur}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        className="w-full sm:w-2/3"
        size="sm"
      />
    </div>
  );
}
