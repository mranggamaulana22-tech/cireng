"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="w-full bg-background border-b border-border px-4 py-3 flex items-center justify-between">
      <h2 className="text-lg font-bold text-primary">Cireng A&R Seyegan</h2>

      <div className="flex items-center gap-3">
        <Link href="/menu" className="text-sm text-foreground hover:text-primary transition-colors">
          Menu
        </Link>
        <Link href="/cart" className="relative text-sm text-foreground hover:text-primary transition-colors">
          Keranjang
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}