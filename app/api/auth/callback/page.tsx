"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // This hits your Fastify server, handles Cognito code exchange
        const res = await axios.get("/api/auth/user", {
          withCredentials: true,
        });

        // Store user in context/localStorage
        localStorage.setItem("user", JSON.stringify(res.data));
        router.push("/"); // redirect to homepage or dashboard
      } catch (error) {
        console.error("Callback failed:", error);
        router.push("/auth");
      }
    };

    handleCallback();
  }, []);

  return <div>Logging in...</div>;
}
