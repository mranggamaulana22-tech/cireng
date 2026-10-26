"use client";

import { useEffect, useState } from "react";
import { Product, ProductCategory } from "../../data/products";
import { useCart } from "../../context/CartContext";
import ProductImage from "../../components/ProductImage";

type TabKey = "semua" | ProductCategory;
type Temperature = "Es" | "Hangat";

const tabs: { key: TabKey; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "makanan", label: "Makanan" },
  { key: "minuman", label: "Minuman" },
];

const temperatures: { value: Temperature; icon: string }[] = [
  { value: "Es", icon: "🧊" },
  { value: "Hangat", icon: "☕" },
];

const NOTE_MAX_LENGTH = 60;

export default function MenuList({ products }: { products: Product[] }) {
  const { items, addItem, updateQuantity } = useCart();
  const [activeTab, setActiveTab] = useState<TabKey>("semua");

  // Popup pilihan minuman (terbuka kalau pickerProduct tidak null)
  const [pickerProduct, setPickerProduct] = useState<Product | null>(null);
  const [temperature, setTemperature] = useState<Temperature | null>(null);
  const [drinkNote, setDrinkNote] = useState("");
  // Area layar yang benar-benar terlihat (mengecil saat keyboard muncul),
  // dipakai supaya popup tetap di tengah area yang terlihat.
  const [viewportBox, setViewportBox] = useState<{
    top: number;
    height: number;
    keyboardOpen: boolean;
  } | null>(null);

  const hasDrinks = products.some((p) => p.category === "minuman");
  const visibleProducts =
    activeTab === "semua"
      ? products
      : products.filter((p) => p.category === activeTab);

  // Jumlah untuk produk biasa (id keranjang = id produk)
  function getQty(productId: number) {
    const found = items.find((item) => item.id === String(productId));
    return found ? found.quantity : 0;
  }

  // Jumlah gabungan semua varian untuk produk yang punya pilihan suhu
  // (id keranjang diawali "<id produk>-")
  function getVariantQty(productId: number) {
    const prefix = `${productId}-`;
    return items
      .filter((item) => item.id.startsWith(prefix))
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  function increase(product: Product) {
    const currentQty = getQty(product.id);
    if (currentQty === 0) {
      addItem({
        id: String(product.id),
        name: product.name,
        price: product.price,
        category: product.category,
      });
    } else {
      updateQuantity(String(product.id), currentQty + 1);
    }
  }

  function decrease(productId: number) {
    const currentQty = getQty(productId);
    updateQuantity(String(productId), currentQty - 1);
  }

  useEffect(() => {
    if (!pickerProduct) return;
    const vv = window.visualViewport;
    if (!vv) return;

    function update() {
      const v = window.visualViewport;
      if (!v) return;
      setViewportBox({
        top: v.offsetTop,
        height: v.height,
        keyboardOpen: window.innerHeight - v.height > 120,
      });
    }

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [pickerProduct]);

  function openPicker(product: Product) {
    setPickerProduct(product);
    setTemperature(null);
    setDrinkNote("");
  }

  function closePicker() {
    setPickerProduct(null);
    setViewportBox(null);
    setTemperature(null);
    setDrinkNote("");
  }

  function confirmDrink() {
    if (!pickerProduct || !temperature) return;

    const note = drinkNote.trim();

    // Tulisan di keranjang / WhatsApp, contoh: "Teh Manis (Es, catatan: extra gula, es dikit)"
    const details = [temperature, note ? `catatan: ${note}` : null]
      .filter(Boolean)
      .join(", ");

    // Varian berbeda (suhu / catatan) menjadi baris terpisah di keranjang
    const noteKey = note.toLowerCase().replace(/\s+/g, "-");
    const id = `${pickerProduct.id}-${temperature.toLowerCase()}-${noteKey}`;

    addItem({
      id,
      name: `${pickerProduct.name} (${details})`,
      price: pickerProduct.price,
      category: pickerProduct.category,
    });
    closePicker();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Menu</h1>

      {hasDrinks && (
        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {products.length === 0 && (
        <p className="text-foreground/60">Belum ada produk tersedia.</p>
      )}

      {products.length > 0 && visibleProducts.length === 0 && (
        <p className="text-foreground/60">Belum ada produk di kategori ini.</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {visibleProducts.map((product) => {
          const qty = getQty(product.id);
          const variantQty = getVariantQty(product.id);

          return (
            <div
              key={product.id}
              className="border border-border rounded-lg p-3 bg-background"
            >
              <ProductImage src={product.image_url ?? undefined} alt={product.name} />
              <h3 className="font-semibold text-foreground mt-3">
                {product.name}
              </h3>
              <p className="text-sm text-foreground/70 mt-1">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-primary">
                  Rp{product.price.toLocaleString("id-ID")}
                </span>
                {product.is_available ? (
                  <span className="text-xs text-success font-medium">
                    Tersedia
                  </span>
                ) : (
                  <span className="text-xs text-foreground/50 font-medium">
                    Habis
                  </span>
                )}
              </div>

              {product.is_available && product.has_temperature && (
                <div className="mt-3">
                  {variantQty > 0 && (
                    <p className="text-xs text-foreground/60 mb-1.5 text-center">
                      Di keranjang: {variantQty}
                    </p>
                  )}
                  <button
                    onClick={() => openPicker(product)}
                    className="w-full py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium active:scale-95 transition-transform"
                  >
                    + Pilih
                  </button>
                </div>
              )}

              {product.is_available && !product.has_temperature && (
                <div className="flex items-center justify-between mt-3 py-1">
                  <button
                    onClick={() => decrease(product.id)}
                    disabled={qty === 0}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-foreground/5 text-foreground text-base font-medium active:scale-90 active:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-transform"
                  >
                    −
                  </button>
                  <span className="text-center text-foreground font-semibold text-sm min-w-5">
                    {qty}
                  </span>
                  <button
                    onClick={() => increase(product)}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground text-base font-medium active:scale-90 transition-transform"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pickerProduct && (
        <div
          className={`fixed left-0 right-0 z-100 flex overflow-y-auto bg-black/40 px-6 ${
            viewportBox?.keyboardOpen ? "py-4" : "pt-4 pb-16"
          }`}
          style={
            viewportBox
              ? { top: viewportBox.top, height: viewportBox.height }
              : { top: 0, bottom: 0 }
          }
          onClick={closePicker}
        >
          <div
            className="w-full max-w-xs m-auto bg-background rounded-2xl p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold text-foreground">
              {pickerProduct.name}
            </p>

            <p className="text-xs text-foreground/60 mt-2 mb-1.5">
              Es atau hangat?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {temperatures.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTemperature(t.value)}
                  className={`py-2.5 rounded-lg border text-sm font-semibold active:scale-95 transition-all ${
                    temperature === t.value
                      ? "border-primary bg-primary/15 text-foreground"
                      : "border-border text-foreground/70"
                  }`}
                >
                  <span className="block text-lg mb-0.5">{t.icon}</span>
                  {t.value}
                </button>
              ))}
            </div>

            <p className="text-xs text-foreground/60 mt-3 mb-1.5">
              Catatan (opsional)
            </p>
            <input
              type="text"
              value={drinkNote}
              onChange={(e) => setDrinkNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                if (temperature) {
                  confirmDrink();
                } else {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              enterKeyHint="done"
              maxLength={NOTE_MAX_LENGTH}
              placeholder="Contoh: extra gula, es-nya dikit"
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-base"
            />

            <button
              onClick={confirmDrink}
              disabled={!temperature}
              className="mt-4 w-full py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              {temperature ? "Tambah ke Keranjang" : "Pilih es atau hangat dulu"}
            </button>

            <button
              onClick={closePicker}
              className="mt-1 w-full py-1.5 text-xs text-foreground/60"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </main>
  );
}