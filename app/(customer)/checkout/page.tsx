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
  getDeliveryFee,
  FREE_DELIVERY_THRESHOLD,
  type DeliveryType,
} from "../../data/orderUtils";
import { createClient } from "../../lib/supabase/client";

const NAME_STORAGE_KEY = "cireng-ar-customer-name";

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

  // Bumbu hanya relevan untuk makanan. Item tanpa category dianggap makanan
  // (keranjang lama). Pesanan berisi minuman saja tidak diminta memilih bumbu.
  const needsSeasoning = items.some((item) => item.category !== "minuman");

  // Ongkir Reguler & Express dihitung terpisah supaya harganya bisa ditampilkan
  // di tiap pilihan pengiriman.
  const regularFee = getDeliveryFee(subtotal, "REGULER", feeRegular, feeExpress);
  const expressFee = getDeliveryFee(subtotal, "EXPRESS", feeRegular, feeExpress);
  const deliveryFee = deliveryType === "EXPRESS" ? expressFee : regularFee;
  const total = subtotal + deliveryFee;

  const remainingForCheaper = FREE_DELIVERY_THRESHOLD - subtotal;
  const regularFeeAtThreshold = getDeliveryFee(
    FREE_DELIVERY_THRESHOLD,
    "REGULER",
    feeRegular,
    feeExpress
  );

  const noSeasoning = seasonings.includes(NO_SEASONING_ID);
  const seasoningLimitReached =
    !noSeasoning && seasonings.length >= MAX_SEASONINGS;

  // Nomor langkah menyesuaikan: langkah bumbu hilang kalau tidak dibutuhkan.
  const stepDelivery = needsSeasoning ? 3 : 2;
  const stepNote = stepDelivery + 1;
  const stepPayment = stepDelivery + 2;

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

    if (needsSeasoning && seasonings.length === 0) {
      alert("Pilih bumbu dulu ya (atau pilih Tanpa bumbu).");
      return;
    }

    localStorage.setItem(NAME_STORAGE_KEY, name);

    const orderCode = generateOrderCode();

    const itemLines = items
      .map((item) => `- ${item.name} x${item.quantity}`)
      .join("\n");

    const finalSeasonings = needsSeasoning ? seasonings : [];
    const seasoningLine = needsSeasoning
      ? `Bumbu: ${getSeasoningLabel(finalSeasonings)}\n\n`
      : "";

    const deliveryLabel =
      deliveryType === "EXPRESS"
        ? `Express (Rp${expressFee.toLocaleString("id-ID")})`
        : regularFee > 0
        ? `Reguler (Rp${regularFee.toLocaleString("id-ID")})`
        : "Reguler (Gratis)";

    const message = `Halo Cireng A & R 👋

Saya ingin memesan:

Kode Pesanan: ${orderCode}
Nama: ${name}

Pesanan:
${itemLines}

${seasoningLine}Subtotal: Rp${subtotal.toLocaleString("id-ID")}
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
      seasonings: finalSeasonings,
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

        {needsSeasoning && (
          <div>
            <h2 className="font-semibold text-foreground mb-1">
              2. Pilih Bumbu
            </h2>
            <p className="text-xs text-foreground/50 mb-2">
              Pilih 1 atau maksimal {MAX_SEASONINGS} bumbu untuk pesanan
              makanan.
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
        )}

        <div>
          <h2 className="font-semibold text-foreground mb-2">
            {stepDelivery}. Jenis Pengiriman
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
                  {regularFee > 0
                    ? `Rp${regularFee.toLocaleString("id-ID")}`
                    : "Gratis"}
                </span>
              </div>
              <p className="text-xs text-foreground/60 mt-1.5 ml-6">
                Gratis ongkir untuk belanja mulai Rp
                {FREE_DELIVERY_THRESHOLD.toLocaleString("id-ID")}; di bawah itu
                dikenai ongkir. Pengiriman mengikuti rute pengantaran, jadi
                persiapan bisa sedikit lebih lama karena digabung dengan
                pesanan lain di rute yang sama.
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
                  Rp{expressFee.toLocaleString("id-ID")}
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
            {stepNote}. Catatan untuk Penjual
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
            {stepPayment}. Pembayaran
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

          {deliveryType === "REGULER" &&
            remainingForCheaper > 0 &&
            regularFee > regularFeeAtThreshold && (
              <p className="mt-2 text-xs text-center text-primary bg-primary/10 border border-primary/30 rounded-md py-2 px-3">
                Tambah Rp{remainingForCheaper.toLocaleString("id-ID")} lagi
                untuk{" "}
                {regularFeeAtThreshold === 0
                  ? "gratis ongkir"
                  : "ongkir lebih murah"}
                .
              </p>
            )}
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