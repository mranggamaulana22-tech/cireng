"use client";

import { useState } from "react";
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

export default function MenuList({ products }: { products: Product[] }) {
  const { items, addItem, updateQuantity } = useCart();
  const [activeTab, setActiveTab] = useState<TabKey>("semua");
  // Minuman yang sedang dipilih es/hangat-nya (popup terbuka kalau tidak null)
  const [pickerProduct, setPickerProduct] = useState<Product | null>(null);

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

  // Jumlah gabungan Es + Hangat untuk produk yang punya pilihan suhu
  // (id keranjang = "<id produk>-es" / "<id produk>-hangat")
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

  function addWithTemperature(product: Product, temperature: Temperature) {
    addItem({
      id: `${product.id}-${temperature.toLowerCase()}`,
      name: `${product.name} (${temperature})`,
      price: product.price,
      category: product.category,
    });
    setPickerProduct(null);
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
                    onClick={() => setPickerProduct(product)}
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
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-6 pb-16"
          onClick={() => setPickerProduct(null)}
        >
          <div
            className="w-full max-w-xs bg-background rounded-2xl p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold text-foreground">
              {pickerProduct.name}
            </p>
            <p className="text-xs text-foreground/60 mt-0.5 mb-3">
              Mau yang es atau hangat?
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addWithTemperature(pickerProduct, "Es")}
                className="py-3 rounded-lg border border-primary/40 bg-primary/5 text-foreground text-sm font-semibold active:scale-95 transition-transform"
              >
                <span className="block text-xl mb-0.5">🧊</span>
                Es
              </button>
              <button
                onClick={() => addWithTemperature(pickerProduct, "Hangat")}
                className="py-3 rounded-lg border border-primary/40 bg-primary/5 text-foreground text-sm font-semibold active:scale-95 transition-transform"
              >
                <span className="block text-xl mb-0.5">☕</span>
                Hangat
              </button>
            </div>

            <button
              onClick={() => setPickerProduct(null)}
              className="mt-2 w-full py-1.5 text-xs text-foreground/60"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </main>
  );
}