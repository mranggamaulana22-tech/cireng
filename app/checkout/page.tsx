"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { generateOrderCode, BUSINESS_WHATSAPP_NUMBER } from "../data/orderUtils";

const NAME_STORAGE_KEY = "cireng-ar-customer-name";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState<"COD" | "QRIS">("COD");

  useEffect(() => {
    const savedName = localStorage.getItem(NAME_STORAGE_KEY);
    if (savedName) {
      setName(savedName);
    }
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/menu");
    }
  }, [items, router]);

  function handleSubmit() {
    if (!name.trim()) {
      alert("Nama wajib diisi ya.");
      return;
    }

    localStorage.setItem(NAME_STORAGE_KEY, name);

    const orderCode = generateOrderCode();

    const itemLines = items
      .map((item) => `- ${item.name} x${item.quantity}`)
      .join("\n");

    const message = `Halo Cireng A & R 👋

Saya ingin memesan:

Kode Pesanan: ${orderCode}
Nama: ${name}

Pesanan:
${itemLines}

Total: Rp${subtotal.toLocaleString("id-ID")}
Pengiriman: Delivery Seyegan
Pembayaran: ${payment}
${note ? `\nCatatan: ${note}` : ""}

Saya akan mengirim lokasi setelah ini.

Terima kasih 🙏`;

    const waUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    const orderRecord = {
      orderCode,
      name,
      items,
      subtotal,
      payment,
      note,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(
      `cireng-ar-order-${orderCode}`,
      JSON.stringify(orderRecord)
    );

    clearCart();
    window.location.href = waUrl;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Checkout</h1>

      <div className="flex flex-col gap-5">
        <div>
          <h2 className="font-semibold text-foreground mb-2">
            1. Data Customer
          </h2>
          <label className="text-sm text-foreground/70 mb-1 block">
            Nama
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kamu"
            className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground"
          />
          <p className="text-xs text-foreground/50 mt-1">
            Nomor WhatsApp otomatis diketahui dari sesi chat.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-foreground mb-2">2. Delivery</h2>
          <div className="border border-border rounded-md p-3 bg-foreground/5">
            <p className="text-sm font-medium text-foreground">
              Delivery Seyegan - Gratis
            </p>
            <p className="text-xs text-foreground/60 mt-1">
              Estimasi dikonfirmasi via WhatsApp.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-foreground mb-2">
            3. Catatan untuk Penjual
          </h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: rumah pagar hitam, titip tanpa cabai, dsb."
            rows={3}
            className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground"
          />
          <p className="text-xs text-foreground/50 mt-1">
            Lokasi tepat akan dibagikan melalui share location di WhatsApp
            setelah checkout.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-foreground mb-2">
            4. Pembayaran
          </h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                checked={payment === "COD"}
                onChange={() => setPayment("COD")}
              />
              COD
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                checked={payment === "QRIS"}
                onChange={() => setPayment("QRIS")}
              />
              QRIS
            </label>
          </div>
        </div>

        <div className="flex justify-between font-bold text-lg text-foreground border-t border-border pt-4">
          <span>Total Pesanan</span>
          <span>Rp{subtotal.toLocaleString("id-ID")}</span>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Lanjut ke WhatsApp
        </button>
      </div>
    </main>
  );
}