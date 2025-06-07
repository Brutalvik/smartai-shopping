// app/layout.tsx
import "@/styles/globals.css";
import AppLayout from "@/components/AppLayout";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
