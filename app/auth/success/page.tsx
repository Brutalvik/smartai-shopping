"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AuthSuccess() {
  const router = useRouter();
  const { setUser } = useUser(); // ✅ Get setUser from context

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          router.push("/dashboard");
        } else {
          router.push("/auth");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        router.push("/auth");
      }
    };
    fetchUser();
  }, [setUser, router]);

  return <p className="text-center mt-10">Redirecting...</p>;
}
