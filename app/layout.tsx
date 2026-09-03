import type { Metadata } from "next";
import "./globals.css";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import ThemeProvider from "./components/ThemeProvider";
import { CartProvider } from "./context/CartContext";
import CartStickyBar from "./components/CartStickyBar";

export const metadata: Metadata = {
  title: "Cireng A & R Seyegan",
  description: "Website Cireng A & R Seyegan",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <CartProvider>
            <Header />
            <div className="flex-1 pb-20">{children}</div>
            <CartStickyBar />
            <BottomNav />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}