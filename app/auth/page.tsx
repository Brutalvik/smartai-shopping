// app/(auth)/page.tsx
"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import CustomLoader from "@/components/ui/CustomLoader/CustomLoader";

const AuthFlow = dynamic(() => import("@/components/auth/AuthFlow"), {
  ssr: false,
  loading: () => <CustomLoader />,
});

export default function AuthPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mt-10 flex items-center justify-center"
    >
      <AuthFlow />
    </motion.div>
  );
}
