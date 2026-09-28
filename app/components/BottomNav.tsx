"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { Home, UtensilsCrossed, ShoppingCart, Menu as MenuIcon } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/cart", label: "Keranjang", icon: ShoppingCart },
    { href: "/lainnya", label: "Lainnya", icon: MenuIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-md h-[calc(88px+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] bg-background border-t border-border flex items-center justify-around z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center gap-1 px-2 py-1"
          >
            <div
              className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-transform duration-150 active:scale-90 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/5 text-foreground/50"
              }`}
            >
              <Icon size={20} />
            </div>
            <span
              className={`text-xs ${
                isActive ? "text-primary font-medium" : "text-foreground/50"
              }`}
            >
              {item.label}
            </span>

            {item.href === "/cart" && totalItems > 0 && (
              <span className="absolute top-0 right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}