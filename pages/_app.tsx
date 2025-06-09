// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import AppLayout from "@/components/AppLayout";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import { useState, useEffect } from "react";
import Router from "next/router";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";

export default function ProtectedApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => {
      setTimeout(() => setLoading(false), 50);
    };
    const handleError = () => setLoading(false);

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleError);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleComplete);
      Router.events.off("routeChangeError", handleError);
    };
  }, []);

  return (
    <div
      className={clsx(
        "min-h-screen text-foreground bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.3s ease-in-out",
            opacity: loading ? 1 : 0,
          }}
        >
          <XyvoLoader />
        </div>
      )}
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </div>
  );
}
