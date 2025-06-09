"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";
import { RiKeyFill } from "react-icons/ri"; // Import RiKeyFill

interface AuthFormLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  showSocials?: boolean;
  alternativeAuthLink?: {
    text: string;
    href: string;
    linkText: string;
  };
  showKeyIcon?: boolean; // New prop
}

export default function AuthFormLayout({
  title,
  subtitle,
  children,
  showSocials = true,
  alternativeAuthLink,
  showKeyIcon = false, // Default to false
}: AuthFormLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-2 w-full max-w-full mx-auto lg:mt-0 shadow-2xl backdrop-blur bg-grey/10 bg-white/10">
        <CardHeader className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-4">
            {showKeyIcon ? ( // Conditionally render RiKeyFill
              <RiKeyFill size={50} className="text-default-500" />
            ) : (
              <div className="flex items-center gap-1">
                <Image
                  src="/x.png"
                  alt="XYVO Logo"
                  className="h-10 w-10 object-contain"
                  width={40}
                  height={40}
                />
              </div>
            )}
          </div>
          <h2 className="text-lg font-medium text-center text-default-600">
            {title}
          </h2>
          <p className="text-sm text-center text-default-400">{subtitle}</p>
        </CardHeader>

        <CardBody className="space-y-2">{children}</CardBody>

        <CardFooter className="flex flex-col space-y-1">
          <p className="text-xs text-center px-2">
            By continuing, you agree to XYVO&apos;s{" "}
            <Link href="/conditions" className="underline hover:text-blue-500">
              Conditions of Use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-blue-500">
              Privacy Notice
            </Link>
            .
          </p>

          {alternativeAuthLink && (
            <div className="text-xs text-center">
              {alternativeAuthLink.text}{" "}
              <Link
                href={alternativeAuthLink.href}
                className="underline hover:text-blue-500"
              >
                {alternativeAuthLink.linkText}
              </Link>
            </div>
          )}

          {showSocials && (
            <>
              <div className="mt-3 text-center text-xs text-white/70">
                or continue with
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <FcGoogle size={30} className="cursor-pointer" />
                <FaFacebook
                  size={26}
                  className="cursor-pointer text-blue-600"
                />
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
