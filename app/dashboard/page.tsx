"use client";

import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/auth");
    }
  }, [user]);

  if (!user) return <p className="text-center mt-10">Checking login...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">
        Welcome, {user.firstName || user.email}!
      </h1>
      <p className="mt-2">This is your dashboard.</p>
    </div>
  );
}
