"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";

const MINIMUM_ORDER = 10000;

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  const isBelowMinimum = subtotal < MINIMUM_ORDER;

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Keranjang</h1>
        <p className="text-foreground/60 mb-6">Keranjang kamu masih kosong.</p>
        <Link
          href="/menu"
          className="inline-block py-2 px-6 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Lihat Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Keranjang</h1>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              <p className="text-sm text-foreground/60">
                Rp{item.price.toLocaleString("id-ID")} / pcs
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-foreground/5 text-foreground text-base font-medium active:scale-90 active:bg-primary/20 transition-transform"
                >
                  −
                </button>
                <span className="text-center text-foreground font-semibold text-sm min-w-[20px]">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground text-base font-medium active:scale-90 transition-transform"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-foreground/40 hover:text-red-500 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-border pt-4 flex flex-col gap-2">
        <div className="flex justify-between text-sm text-foreground/70">
          <span>Subtotal</span>
          <span>Rp{subtotal.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-sm text-success">
          <span>Delivery</span>
          <span>Gratis</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-foreground">
          <span>Total</span>
          <span>Rp{subtotal.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {isBelowMinimum && (
        <p className="mt-4 text-sm text-center text-primary bg-primary/10 border border-primary/30 rounded-md py-2 px-3">
          Minimum order delivery adalah Rp{MINIMUM_ORDER.toLocaleString("id-ID")}.
        </p>
      )}

      {isBelowMinimum ? (
        <button
          disabled
          className="mt-4 w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold opacity-40 cursor-not-allowed"
        >
          Checkout
        </button>
      ) : (
        <Link
          href="/checkout"
          className="mt-4 block w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold text-center hover:opacity-90 transition-opacity"
        >
          Checkout
        </Link>
      )}
    </main>
  );
}