"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CartStickyBar() {
  const pathname = usePathname();
  const { items, subtotal } = useCart();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Jangan tampilkan di halaman Cart/Checkout (sudah redundan) atau saat keranjang kosong
  if (pathname === "/cart" || pathname === "/checkout" || totalItems === 0) {
    return null;
  }

  return (
    <Link
      href="/cart"
      className="fixed bottom-[calc(88px+env(safe-area-inset-bottom))] left-0 right-0 mx-auto max-w-md bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between rounded-t-lg shadow-lg z-40"
    >
      <span className="text-sm font-medium">
        {totalItems} item · Rp{subtotal.toLocaleString("id-ID")}
      </span>
      <span className="text-sm font-semibold">Lihat Keranjang →</span>
    </Link>
  );
}