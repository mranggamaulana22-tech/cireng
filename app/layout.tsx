import type { Metadata } from "next";
import "./globals.css";

import ThemeProvider from "./components/ThemeProvider";
import { CartProvider } from "./context/CartContext";

export const metadata: Metadata = {
  title: {
    default: "Cireng A&R Seyegan - Jajanan Cireng Enak di Seyegan",
    template: "%s | Cireng A&R Seyegan",
  },
  description:
    "Cireng A&R Seyegan menyediakan aneka cireng isi ayam suwir, bakso, sosis, keju, cipuk, dan telur gulung. Pesan online, kami antar ke area Seyegan.",
  metadataBase: new URL("https://cirengar.com"),
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <CartProvider>{children}</CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}