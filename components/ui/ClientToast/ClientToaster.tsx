// components/ClientToaster.tsx
"use client";
import { Toaster } from "react-hot-toast";

export default function ClientToaster() {
  return <Toaster position="bottom-right" reverseOrder={false} />;
}
