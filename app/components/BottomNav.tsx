"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/cart", label: "Keranjang", icon: ShoppingCart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex items-center justify-around py-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center gap-0.5 px-4 py-1"
          >
            <Icon
              size={22}
              className={isActive ? "text-primary" : "text-foreground/50"}
            />
            <span
              className={`text-xs ${
                isActive ? "text-primary font-medium" : "text-foreground/50"
              }`}
            >
              {item.label}
            </span>

            {item.href === "/cart" && totalItems > 0 && (
              <span className="absolute -top-0.5 right-2 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}