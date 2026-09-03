"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type OrderRecord = {
  orderCode: string;
  name: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  payment: string;
  note: string;
  createdAt: string;
};

export default function OrderStatusPage() {
  const params = useParams();
  const orderCode = params.orderCode as string;

  const [order, setOrder] = useState<OrderRecord | null | undefined>(
    undefined
  );

  useEffect(() => {
    const saved = localStorage.getItem(`cireng-ar-order-${orderCode}`);
    if (saved) {
      setOrder(JSON.parse(saved));
    } else {
      setOrder(null);
    }
  }, [orderCode]);

  // Masih proses baca localStorage
  if (order === undefined) {
    return null;
  }

  // Order tidak ditemukan
  if (order === null) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Pesanan Tidak Ditemukan
        </h1>
        <p className="text-foreground/60 mb-6">
          Kode pesanan {orderCode} tidak ditemukan di perangkat ini.
        </p>
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
      <h1 className="text-2xl font-bold text-foreground mb-1">
        Pesanan #{order.orderCode}
      </h1>
      <p className="text-sm text-primary font-medium mb-6">
        Menunggu konfirmasi
      </p>

      <div className="border border-border rounded-lg p-4 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Nama</span>
          <span className="text-foreground font-medium">{order.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Pembayaran</span>
          <span className="text-foreground font-medium">{order.payment}</span>
        </div>

        <div className="border-t border-border my-2" />

        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-foreground">
              {item.name} x{item.quantity}
            </span>
            <span className="text-foreground/70">
              Rp{(item.price * item.quantity).toLocaleString("id-ID")}
            </span>
          </div>
        ))}

        <div className="border-t border-border my-2" />

        <div className="flex justify-between font-bold text-foreground">
          <span>Total</span>
          <span>Rp{order.subtotal.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <p className="text-xs text-foreground/50 mt-4 text-center">
        Pesanan akan dikonfirmasi melalui WhatsApp.
      </p>
    </main>
  );
}