import type { Metadata } from "next";
import "./globals.css";

import Header from "./components/Header";
import ThemeProvider from "./components/ThemeProvider";

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
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}