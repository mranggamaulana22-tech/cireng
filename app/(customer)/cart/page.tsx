"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { createClient } from "../../lib/supabase/client";
import {
  FREE_DELIVERY_THRESHOLD,
  getDeliveryFee,
} from "../../data/orderUtils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const supabase = createClient();

  const [feeRegular, setFeeRegular] = useState(0);

  useEffect(() => {
    async function loadFee() {
      const { data } = await supabase
        .from("store_status")
        .select("delivery_fee_regular")
        .limit(1)
        .single();

      if (data) {
        setFeeRegular(data.delivery_fee_regular ?? 0);
      }
    }
    loadFee();
  }, []);

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

  // Estimasi ongkir Reguler. Express bisa dipilih di halaman checkout.
  const deliveryFee = getDeliveryFee(subtotal, "REGULER", feeRegular, 0);
  const total = subtotal + deliveryFee;

  const remainingForCheaper = FREE_DELIVERY_THRESHOLD - subtotal;
  const feeAtThreshold = getDeliveryFee(
    FREE_DELIVERY_THRESHOLD,
    "REGULER",
    feeRegular,
    0
  );

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
                <span className="text-center text-foreground font-semibold text-sm min-w-5">
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
        <div
          className={`flex justify-between text-sm ${
            deliveryFee > 0 ? "text-foreground/70" : "text-success"
          }`}
        >
          <span>Ongkir (Reguler)</span>
          <span>
            {deliveryFee > 0
              ? `Rp${deliveryFee.toLocaleString("id-ID")}`
              : "Gratis"}
          </span>
        </div>
        <div className="flex justify-between font-bold text-lg text-foreground">
          <span>Total</span>
          <span>Rp{total.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {remainingForCheaper > 0 && deliveryFee > feeAtThreshold && (
        <p className="mt-4 text-sm text-center text-primary bg-primary/10 border border-primary/30 rounded-md py-2 px-3">
          Tambah Rp{remainingForCheaper.toLocaleString("id-ID")} lagi untuk{" "}
          {feeAtThreshold === 0 ? "gratis ongkir" : "ongkir lebih murah"}.
        </p>
      )}

      <Link
        href="/checkout"
        className="mt-4 block w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold text-center hover:opacity-90 transition-opacity"
      >
        Checkout
      </Link>
    </main>
  );
}