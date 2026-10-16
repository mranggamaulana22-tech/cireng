"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import {
  generateOrderCode,
  BUSINESS_WHATSAPP_NUMBER,
  SEASONINGS,
  MAX_SEASONINGS,
  NO_SEASONING_ID,
  getSeasoningLabel,
} from "../../data/orderUtils";
import { createClient } from "../../lib/supabase/client";

const NAME_STORAGE_KEY = "cireng-ar-customer-name";

type DeliveryType = "REGULER" | "EXPRESS";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState<"COD" | "QRIS">("COD");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("REGULER");
  const [seasonings, setSeasonings] = useState<string[]>([]);

  const [feeRegular, setFeeRegular] = useState(0);
  const [feeExpress, setFeeExpress] = useState(5000);

  useEffect(() => {
    const savedName = localStorage.getItem(NAME_STORAGE_KEY);
    if (savedName) {
      setName(savedName);
    }
  }, []);

  useEffect(() => {
    async function loadFees() {
      const { data } = await supabase
        .from("store_status")
        .select("delivery_fee_regular, delivery_fee_express")
        .limit(1)
        .single();

      if (data) {
        setFeeRegular(data.delivery_fee_regular ?? 0);
        setFeeExpress(data.delivery_fee_express ?? 5000);
      }
    }
    loadFees();
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/menu");
    }
  }, [items, router]);

  const deliveryFee = deliveryType === "EXPRESS" ? feeExpress : feeRegular;
  const total = subtotal + deliveryFee;

  const noSeasoning = seasonings.includes(NO_SEASONING_ID);
  const seasoningLimitReached =
    !noSeasoning && seasonings.length >= MAX_SEASONINGS;

  function toggleNoSeasoning() {
    setSeasonings((prev) => (prev.includes(NO_SEASONING_ID) ? [] : [NO_SEASONING_ID]));
  }

  function toggleSeasoning(id: string) {
    setSeasonings((prev) => {
      const current = prev.filter((s) => s !== NO_SEASONING_ID);
      if (current.includes(id)) {
        return current.filter((s) => s !== id);
      }
      if (current.length >= MAX_SEASONINGS) {
        return current;
      }
      return [...current, id];
    });
  }

  function handleSubmit() {
    if (!name.trim()) {
      alert("Nama wajib diisi ya.");
      return;
    }

    if (seasonings.length === 0) {
      alert("Pilih bumbu dulu ya (atau pilih Tanpa bumbu).");
      return;
    }

    localStorage.setItem(NAME_STORAGE_KEY, name);

    const orderCode = generateOrderCode();

    const itemLines = items
      .map((item) => `- ${item.name} x${item.quantity}`)
      .join("\n");

    const seasoningLabel = getSeasoningLabel(seasonings);

    const deliveryLabel =
      deliveryType === "EXPRESS"
        ? `Express (Rp${feeExpress.toLocaleString("id-ID")})`
        : feeRegular > 0
        ? `Reguler (Rp${feeRegular.toLocaleString("id-ID")})`
        : "Reguler (Gratis)";

    const message = `Halo Cireng A & R 👋

Saya ingin memesan:

Kode Pesanan: ${orderCode}
Nama: ${name}

Pesanan:
${itemLines}

Bumbu: ${seasoningLabel}

Subtotal: Rp${subtotal.toLocaleString("id-ID")}
Pengiriman: ${deliveryLabel}
Total: Rp${total.toLocaleString("id-ID")}
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
      seasonings,
      deliveryType,
      deliveryFee,
      total,
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
          <h2 className="font-semibold text-foreground mb-1">
            2. Pilih Bumbu
          </h2>
          <p className="text-xs text-foreground/50 mb-2">
            Pilih 1 atau maksimal {MAX_SEASONINGS} bumbu untuk pesanan.
          </p>

          <div className="flex flex-col gap-2">
            {SEASONINGS.map((seasoning) => {
              const checked = seasonings.includes(seasoning.id);
              const disabled = noSeasoning || (!checked && seasoningLimitReached);
              return (
                <label
                  key={seasoning.id}
                  className={`border rounded-md p-3 flex items-center gap-2 transition-colors ${
                    checked ? "border-primary bg-primary/5" : "border-border"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggleSeasoning(seasoning.id)}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {seasoning.name}
                  </span>
                </label>
              );
            })}

            <label
              className={`border rounded-md p-3 flex items-center gap-2 cursor-pointer transition-colors ${
                noSeasoning ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <input
                type="checkbox"
                checked={noSeasoning}
                onChange={toggleNoSeasoning}
              />
              <span className="text-sm font-medium text-foreground">
                Tanpa bumbu
              </span>
            </label>
          </div>

          <p className="text-xs text-foreground/50 mt-2">
            {noSeasoning
              ? "Pesanan tanpa bumbu."
              : `Dipilih ${seasonings.length}/${MAX_SEASONINGS}.`}
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-foreground mb-2">
            3. Jenis Pengiriman
          </h2>

          <div className="flex flex-col gap-2">
            <label
              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                deliveryType === "REGULER"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={deliveryType === "REGULER"}
                    onChange={() => setDeliveryType("REGULER")}
                  />
                  <span className="font-medium text-foreground text-sm">
                    Reguler
                  </span>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {feeRegular > 0
                    ? `Rp${feeRegular.toLocaleString("id-ID")}`
                    : "Gratis"}
                </span>
              </div>
              <p className="text-xs text-foreground/60 mt-1.5 ml-6">
                Gratis ongkir selama masa promo launching. Pengiriman
                mengikuti rute pengantaran, jadi persiapan bisa sedikit lebih
                lama karena digabung dengan pesanan lain di rute yang sama.
              </p>
            </label>

            <label
              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                deliveryType === "EXPRESS"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={deliveryType === "EXPRESS"}
                    onChange={() => setDeliveryType("EXPRESS")}
                  />
                  <span className="font-medium text-foreground text-sm">
                    Express
                  </span>
                </div>
                <span className="text-sm font-semibold text-primary">
                  Rp{feeExpress.toLocaleString("id-ID")}
                </span>
              </div>
              <p className="text-xs text-foreground/60 mt-1.5 ml-6">
                Pengiriman prioritas. Pesanan langsung disiapkan begitu
                dikonfirmasi, tanpa menunggu rute pengantaran lainnya.
              </p>
            </label>
          </div>

          <p className="text-xs text-foreground/50 mt-2">
            Estimasi waktu tiba akan dikonfirmasi melalui WhatsApp.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-foreground mb-2">
            4. Catatan untuk Penjual
          </h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: rumah pagar hitam, saus nya dipisah, dsb."
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
            5. Pembayaran
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

        <div className="border-t border-border pt-4 flex flex-col gap-1.5">
          <div className="flex justify-between text-sm text-foreground/70">
            <span>Subtotal</span>
            <span>Rp{subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-sm text-foreground/70">
            <span>Ongkir ({deliveryType === "EXPRESS" ? "Express" : "Reguler"})</span>
            <span>
              {deliveryFee > 0
                ? `Rp${deliveryFee.toLocaleString("id-ID")}`
                : "Gratis"}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg text-foreground mt-1">
            <span>Total</span>
            <span>Rp{total.toLocaleString("id-ID")}</span>
          </div>
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