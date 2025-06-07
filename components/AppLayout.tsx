// components/layouts/AppLayout.tsx
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { Providers } from "@/app/providers"; // only if this is not App Router specific
import AppLoadingWrapper from "@/components/shared/AppLoadingWrapper";
import { AppLoaderProvider } from "@/context/AppLoaderContext";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLoaderProvider>
      <AppLoadingWrapper>
        <UserProvider>
          <CartProvider>
            <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
              <div  className={clsx(
                      "min-h-screen text-foreground bg-background font-sans antialiased",
                      fontSans.variable
                    )}>
              <div className="relative flex flex-col min-h-screen font-sans antialiased">
                <Navbar />
                <main className="container mx-auto max-w-7xl px-6 flex-grow">{children}</main>
                <footer className="w-full flex items-center justify-center py-3 text-xs">
                  <p>
                    © {new Date().getFullYear()} <span className="font-semibold">Xyvo</span> —
                    All rights reserved.
                  </p>
                </footer>
              </div>
              </div>
            </Providers>
          </CartProvider>
        </UserProvider>
      </AppLoadingWrapper>
    </AppLoaderProvider>
  );
}
