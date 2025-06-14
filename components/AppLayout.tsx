// components/layouts/AppLayout.tsx
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/CartContext";
import { Providers } from "@/app/providers";
import AppLoadingWrapper from "@/components/shared/AppLoadingWrapper";
import { AppLoaderProvider } from "@/context/AppLoaderContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLoaderProvider>
      <AppLoadingWrapper>
        <CartProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col min-h-screen font-sans antialiased">
              <Navbar />
              <main className="container mx-auto max-w-fit flex-grow">
                {children}
              </main>
              <footer className="w-full flex items-center justify-center py-3 text-xs">
                <p>
                  © {new Date().getFullYear()}{" "}
                  <span className="font-semibold">Xyvo</span> — All rights
                  reserved.
                </p>
              </footer>
            </div>
          </Providers>
        </CartProvider>
      </AppLoadingWrapper>
    </AppLoaderProvider>
  );
}
