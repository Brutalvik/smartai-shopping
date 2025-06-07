"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import Image from "next/image";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 py-10">
      <div className="w-full max-w-md">
        <Image
          src="/unauthorized.png"
          alt="Unauthorized Access"
          width={500}
          height={300}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      <div className="text-center mt-8">
        <h1 className="text-3xl font-bold text-red-600 mb-2">Unauthorized</h1>
        <p className="text-gray-700 mb-6">
          You don&apos;t have permission to access this page. Please login or register to continue.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="bordered" onPress={() => router.push("/")}>Home</Button>
          <Button variant="shadow" onPress={() => router.push("/auth/login")}>Login</Button>
          <Button variant="solid" onPress={() => router.push("/auth/register")}>Register</Button>
        </div>
      </div>
    </div>
  );
}
