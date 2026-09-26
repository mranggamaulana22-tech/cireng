import type { Metadata } from "next";
import "./globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import ThemeProvider from "./components/ThemeProvider";
import { CartProvider } from "./context/CartContext";

export const metadata: Metadata = {
  title: {
    default: "Cireng A&R Seyegan - Delivery Cireng Area Seyegan",
    template: "%s | Cireng A&R Seyegan",
  },
  description:
    "Cireng A&R Seyegan menyediakan aneka cireng isi ayam suwir, bakso, sosis, keju, cipuk, dan telur gulung. Pesan online, kami antar ke area Seyegan.",
  metadataBase: new URL("https://cirengseyegan.me"),
  manifest: "/manifest.json",
  verification: {
    google: "gzNcRUCwD9xkS6t91cEk5oNZp3aD92yFazwdPlHv2hA",
  },
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
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </body>
    </html>
  );
}