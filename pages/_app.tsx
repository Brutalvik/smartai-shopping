// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import AppLayout from "@/components/AppLayout";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";

export default function ProtectedApp({ Component, pageProps }: AppProps) {
  return (
    <div
      className={clsx(
        "min-h-screen text-foreground bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </div>
  );
}
